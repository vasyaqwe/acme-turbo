/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server"
import { Ratelimit } from "@unkey/ratelimit"
import superjson from "superjson"
import { ZodError } from "zod"

import type { Session } from "@acme/auth"
import { db } from "@acme/db/client"
import { emails } from "@acme/emails"
import { env } from "./env"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = (opts: {
   headers: Headers
   session: Session | null
}) => {
   const session = opts.session
   const source = opts.headers.get("x-trpc-source") ?? "unknown"

   console.log(">>> tRPC Request from", source, "by", session?.user)

   return {
      ...opts,
      session,
      emails,
      db,
   }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
   transformer: superjson,
   errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
         ...shape.data,
         zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
   }),
})

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
   if (!ctx.session?.user || !ctx.session.session?.id)
      throw new TRPCError({ code: "UNAUTHORIZED" })

   return next({
      ctx: {
         // infers the `session` as non-nullable
         session: { ...ctx.session.session, user: ctx.session.user },
      },
   })
})

const getIp = (headers: Headers) => {
   const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]
   const realIp = headers.get("x-real-ip")
   if (forwardedFor) return forwardedFor
   if (realIp) return realIp.trim()
   return null
}

export const publicRateLimitedProcedure = t.procedure.use(
   async ({ ctx, next, path }) => {
      const unkey = new Ratelimit({
         rootKey: env.UNKEY_ROOT_KEY,
         async: true,
         duration: "20s",
         limit: 2,
         namespace: `acme_${path}`,
      })

      const ip = getIp(ctx.headers)
      if (!ip) return next()

      const ratelimit = await unkey.limit(ip)
      if (!ratelimit.success) {
         throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Too many requests, please try again in a bit`,
         })
      }

      return next()
   }
)
