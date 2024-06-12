import { initTRPC, TRPCError } from "@trpc/server"
import { Ratelimit } from "@unkey/ratelimit"
import { ZodError } from "zod"

import type { Session } from "@acme/auth"
import { db } from "@acme/db/client"
import { emails } from "@acme/emails"
import { env } from "./env"
import { transformer } from "./shared"

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

const t = initTRPC.context<typeof createTRPCContext>().create({
   transformer,
   errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
         ...shape.data,
         zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
   }),
})

export const createCallerFactory = t.createCallerFactory

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
   if (!ctx.session?.user || !ctx.session.session?.id)
      throw new TRPCError({ code: "UNAUTHORIZED" })

   return next({
      ctx: {
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
