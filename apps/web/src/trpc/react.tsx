"use client"

import { useState } from "react"
import { env } from "@/env"
import {
   MutationCache,
   QueryClient,
   QueryClientProvider,
} from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import SuperJSON from "superjson"

import type { AppRouter } from "@acme/api"
import { toast } from "@acme/ui/toast"

const createQueryClient = () =>
   new QueryClient({
      mutationCache: new MutationCache({
         onSuccess: (res) => {
            if (res && typeof res === "object" && "serverError" in res)
               throw new Error(res.serverError as string)
         },
      }),
      defaultOptions: {
         queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 1000 * 30,
         },
         mutations: {
            onError: (err) => {
               toast.error(err.message)
            },
         },
      },
   })

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
   if (typeof window === "undefined") {
      // Server: always make a new query client
      return createQueryClient()
   } else {
      // Browser: use singleton pattern to keep the same query client
      return (clientQueryClientSingleton ??= createQueryClient())
   }
}

export const api = createTRPCReact<AppRouter>({
   overrides: {
      useMutation: {
         async onSuccess(opts) {
            await opts.originalFn()
            // Invalidate all queries in the react-query cache:
            await opts.queryClient.invalidateQueries()
         },
      },
   },
})

export function TRPCReactProvider(props: { children: React.ReactNode }) {
   const queryClient = getQueryClient()

   const [trpcClient] = useState(() =>
      api.createClient({
         links: [
            loggerLink({
               enabled: (op) =>
                  env.NODE_ENV === "development" ||
                  (op.direction === "down" && op.result instanceof Error),
            }),
            unstable_httpBatchStreamLink({
               transformer: SuperJSON,
               url: getBaseUrl() + "/api/trpc",
               headers() {
                  const headers = new Headers()
                  headers.set("x-trpc-source", "nextjs-react")
                  return headers
               },
            }),
         ],
      })
   )

   return (
      <api.Provider
         client={trpcClient}
         queryClient={queryClient}
      >
         <QueryClientProvider client={queryClient}>
            {props.children}
         </QueryClientProvider>
      </api.Provider>
   )
}

const getBaseUrl = () => {
   if (typeof window !== "undefined") return window.location.origin
   if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
   // eslint-disable-next-line no-restricted-properties
   return `http://localhost:${process.env.PORT ?? 3000}`
}
