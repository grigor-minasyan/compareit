import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { runFilteredProductSearch } from "~/server/productApi";

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
    .input(z.string().min(1).array().length(2))
    .mutation(async ({ ctx, input }) => {
      const [prod1, prod2] = input;
      // TODO use the input IDs
      await new Promise((resolve) => setTimeout(resolve, 200));
      const prodSearchResult = await runFilteredProductSearch("test");
      // const products = await ctx.utils.searchProducts(query, storeId);
      return [prodSearchResult, prodSearchResult];
    }),
});
