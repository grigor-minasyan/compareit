import { TRPCError } from "@trpc/server";
import { log } from "next-axiom";
import { z } from "zod";
import { UNKNOWN_IP } from "~/constants";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AmazonApiSearch } from "~/server/productApi";
import { rateLimit } from "~/server/redis";

export const homeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  searchProducts: publicProcedure
    .input(z.object({ prod1name: z.string(), prod2name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const ipToLimit = ctx.reqIp || UNKNOWN_IP;
      const { success } = await rateLimit.limit(ipToLimit);
      if (!success) {
        log.error(`Rate limit exceeded for ${ipToLimit}`);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many searches, please slow down",
        });
      }

      let { prod1name, prod2name } = input;
      prod1name = prod1name.toLowerCase().trim();
      prod2name = prod2name.toLowerCase().trim();
      if (prod1name === prod2name) {
        const prod1SearchResult = await AmazonApiSearch(prod1name);
        return { "1": prod1SearchResult, "2": prod1SearchResult };
      } else {
        const [prod1SearchResult, prod2SearchResult] = await Promise.all([
          AmazonApiSearch(prod1name),
          AmazonApiSearch(prod2name),
        ]);
        // const products = await ctx.utils.searchProducts(query, storeId);
        return { "1": prod1SearchResult, "2": prod2SearchResult };
      }
    }),
});
