import { expense } from "./routers/expense"
import { user } from "./routers/user"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
   user,
   expense,
})

export type AppRouter = typeof appRouter
