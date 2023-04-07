import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { AmazonApiSearch } from "~/server/productApi";

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
      if (prod1name === prod2name) {
        const prod1SearchResult = await AmazonApiSearch(prod1name);
        return [prod1SearchResult, prod1SearchResult];
      } else {
        const [prod1SearchResult, prod2SearchResult] = await Promise.all([
          AmazonApiSearch(prod1name),
          AmazonApiSearch(prod2name),
        ]);
        // const products = await ctx.utils.searchProducts(query, storeId);
        return [prod1SearchResult, prod2SearchResult];
      }
    }),
});
