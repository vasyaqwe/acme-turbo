"use client"

import { useState } from "react"
import { env } from "@/env"
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@acme/api"
import { createQueryClient, getUrl } from "@/trpc/shared"
import { transformer } from "@acme/api/shared"

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
               transformer,
               url: getUrl(),
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
