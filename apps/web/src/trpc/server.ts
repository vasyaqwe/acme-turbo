import { cache } from "react"
import { headers } from "next/headers"
import { appRouter, createCallerFactory, createTRPCContext } from "@acme/api"
import { uncachedGetAuthSession } from "@acme/auth"
import { createHydrationHelpers } from "@trpc/react-query/rsc"
import { createQueryClient } from "@/trpc/shared"

const createContext = cache(async () => {
   const heads = new Headers(headers())
   heads.set("x-trpc-source", "rsc")

   return createTRPCContext({
      session: await uncachedGetAuthSession(),
      headers: heads,
   })
})

const getQueryClient = cache(createQueryClient)
export const caller = createCallerFactory(appRouter)(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<
   typeof appRouter
>(caller, getQueryClient)
