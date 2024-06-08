import { eq } from "drizzle-orm"

import { expenses, insertExpenseParams } from "@acme/db/schema/expenses"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const expense = createTRPCRouter({
   getAll: publicProcedure.query(async ({ ctx }) => {
      const res = await ctx.db
         .select()
         .from(expenses)
         .where(eq(expenses.userId, "6499c712-1472-4613-8dab-2fe6928d3922"))

      return res
   }),
   getAll2: protectedProcedure.query(async ({ ctx }) => {
      const res = await ctx.db
         .select()
         .from(expenses)
         .where(eq(expenses.userId, ctx.session.user.id))

      return res
   }),
   insert: protectedProcedure
      .input(insertExpenseParams)
      .mutation(async ({ ctx, input }) => {
         return await ctx.db
            .insert(expenses)
            .values({ ...input, userId: ctx.session.user.id })
      }),
})
