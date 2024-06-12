/* eslint-disable no-restricted-properties */
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"
import { toast } from "@acme/ui/toast"
import { transformer } from "@acme/api/shared"

function getBaseUrl() {
   if (typeof window !== "undefined") return ""
   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
   return "http://localhost:3000"
}

export function getUrl() {
   return getBaseUrl() + "/api/trpc"
}

export const createQueryClient = () =>
   new QueryClient({
      defaultOptions: {
         queries: {
            // Since queries are prefetched on the server, we set a stale time so that
            // queries aren't immediately refetched on the client
            staleTime: 1000 * 30,
         },
         mutations: {
            onError: (e) => {
               const error = e as Error & { digest?: string | undefined }
               //if server action, show generic message
               if (error.digest) {
                  toast.error("Something went wrong")
               } else {
                  toast.error(e.message)
               }
            },
         },
         dehydrate: {
            // include pending queries in dehydration
            shouldDehydrateQuery: (query) =>
               defaultShouldDehydrateQuery(query) ||
               query.state.status === "pending",
         },
         hydrate: {
            // when the promise has resolved, deserialize the data
            // since trpc will serialize it on the server. this
            // allows you to return Date, Temporal etc from your
            // procedure and have that auto-serialize on the client
            transformPromise: (promise) =>
               promise.then(transformer.deserialize),
         },
      },
   })
