import { eq } from "drizzle-orm"

import { expenses, insertExpenseParams } from "@acme/db/schema/expenses"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"

export const expense = createTRPCRouter({
   getAll: publicProcedure.query(async ({ ctx }) => {
      try {
         const user = ctx.session?.user
         if (!user?.id) return []

         // const res = await ctx.db
         //    .select()
         //    .from(expenses)
         //    .where(eq(expenses.userId, user.id))

         throw new TRPCError({ code: "NOT_IMPLEMENTED" })
      } catch (error) {
         console.log(error)
      }
   }),
   getAll2: publicProcedure.query(async ({ ctx }) => {
      const user = ctx.session?.user
      if (!user?.id) return []
      const res = await ctx.db
         .select()
         .from(expenses)
         .where(eq(expenses.userId, user.id))

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
