import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AmazonApiSearch } from "~/server/productApi";
import { CACHE_KEY_PREFIX, redisSet } from "~/server/redis";

export const homeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  searchProducts: publicProcedure
    .input(z.object({ prod1name: z.string(), prod2name: z.string() }))
    .mutation(async ({ input }) => {
      const { prod1name, prod2name } = input;
      const [prod1SearchResult, prod2SearchResult] = await Promise.all([
        AmazonApiSearch(prod1name),
        AmazonApiSearch(prod2name),
      ]);
      await Promise.all(
        [...prod1SearchResult, ...prod2SearchResult].map((p) =>
          redisSet(CACHE_KEY_PREFIX.AMZ_API_PRODUCT + p.asin, p)
        )
      );
      // const products = await ctx.utils.searchProducts(query, storeId);
      return [prod1SearchResult, prod2SearchResult];
    }),
});
