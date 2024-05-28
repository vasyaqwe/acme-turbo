import { cache } from "react"
import { headers } from "next/headers"

import {
   appRouter,
   createCaller,
   createCallerFactory,
   createTRPCContext,
} from "@acme/api"
import { uncachedGetAuthSession } from "@acme/auth"
import { createHydrationHelpers } from "@trpc/react-query/rsc"
import { createQueryClient } from "@/trpc/react"
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
   const heads = new Headers(headers())
   heads.set("x-trpc-source", "rsc")

   return createTRPCContext({
      session: await uncachedGetAuthSession(),
      headers: heads,
   })
})

const getQueryClient = cache(createQueryClient)

const caller = createCallerFactory(appRouter)(createContext)

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
   caller,
   getQueryClient
)

export const api = createCaller(createContext)
