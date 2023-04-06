import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import { env } from "~/env.mjs";

export async function OpenAIStream(payload: {
  model: string;
  messages: {
    role: "user" | "system";
    content: string;
  }[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stream: boolean;
  n: number;
  max_tokens?: number;
}) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
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
