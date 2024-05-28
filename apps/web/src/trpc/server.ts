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
import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query"
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

const caller = createCallerFactory(appRouter)(createContext)

const createQueryClient = () =>
   new QueryClient({
      defaultOptions: {
         queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 1000 * 30,
         },
         dehydrate: {
            // include pending queries in dehydration
            shouldDehydrateQuery: (query) =>
               defaultShouldDehydrateQuery(query) ||
               query.state.status === "pending",
         },
      },
   })

const getQueryClient = cache(createQueryClient)

export const { trpc: api, HydrateClient } = createHydrationHelpers<
   typeof appRouter
>(caller, getQueryClient)

export const serverCaller = createCaller(createContext, {
   onError: ({ error, type }) => {
      if (type === "mutation")
         return {
            serverError: error.message,
         }

      throw error
   },
})
