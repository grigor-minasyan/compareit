import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import { backOff } from "exponential-backoff";
import { log } from "next-axiom";
import { serializeError } from "serialize-error";
import { env } from "~/env.mjs";

export async function OpenAIStream(prompt: string) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    }),
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type !== "event") {
          return;
        }

        const data = event.data;
        // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
        if (data === "[DONE]") {
          controller.close();
          return;
        }
        try {
          const json = JSON.parse(data) as unknown as {
            choices: { delta: { content: string } }[];
          };
          const text = json.choices[0]?.delta?.content || "";
          if (counter < 2 && (text.match(/^\n/) || []).length) {
            // this is a prefix character (i.e., "\n\n"), do nothing
            return;
          }
          const queue = encoder.encode(text);
          controller.enqueue(queue);
          counter++;
        } catch (e) {
          // maybe parse error
          controller.error(e);
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as unknown as Uint8Array[]) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

export async function OpenAIDirect(prompt: string) {
  const res = await backOff(
    () =>
      fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          n: 1,
        }),
      }),
    {
      jitter: "full",
      retry(e: unknown, attemptNumber) {
        log.error(
          `OpenAIDirect: Attempt #${attemptNumber} failed. Error:`,
          serializeError(e)
        );
        return true;
      },
    }
  );

  const json = (await res.json()) as unknown as {
    choices: { message: { content: string } }[];
  };
  const text = json.choices[0]?.message.content || "";
  if (!text) {
    throw new Error("No text returned from OpenAI");
  }
  return text;
}
