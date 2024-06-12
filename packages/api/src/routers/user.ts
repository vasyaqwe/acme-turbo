import { cookies } from "next/headers"
import { TRPCError } from "@trpc/server"
import { generateCodeVerifier, generateState } from "arctic"
import { isWithinExpirationDate } from "oslo"

import {
   generateEmailVerificationCode,
   github,
   google,
   lucia,
} from "@acme/auth"
import type { db as database } from "@acme/db/client"
import {
   emailVerificationCodes,
   insertUserParams,
   users,
   verifyLoginCodeParams,
} from "@acme/db/schema/users"
import { EMAIL_FROM } from "@acme/emails"
import { VerificationCodeEmail } from "@acme/emails/emails/verification-code-email"

import {
   createTRPCRouter,
   protectedProcedure,
   publicProcedure,
   publicRateLimitedProcedure,
} from "../trpc"
import { eq } from "@acme/db"

const env = process.env

export const user = createTRPCRouter({
   me: protectedProcedure.query(({ ctx }) => ctx.session.user),
   googleLogin: publicProcedure.mutation(async () => {
      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      cookies().set("state", state, {
         path: "/",
         secure: env.NODE_ENV === "production",
         httpOnly: true,
         maxAge: 60 * 10,
         sameSite: "lax",
      })
      cookies().set("google_code_verifier", codeVerifier, {
         path: "/",
         secure: env.NODE_ENV === "production",
         httpOnly: true,
         maxAge: 60 * 10,
         sameSite: "lax",
      })
      const url = await google.createAuthorizationURL(state, codeVerifier, {
         scopes: ["email", "profile"],
      })

      return { url: url.toString() }
   }),
   githubLogin: publicProcedure.mutation(async () => {
      const state = generateState()
      const url = await github.createAuthorizationURL(state)

      cookies().set("github_oauth_state", state, {
         path: "/",
         secure: env.NODE_ENV === "production",
         httpOnly: true,
         maxAge: 60 * 10,
         sameSite: "lax",
      })

      return { url: url.toString() }
   }),
   sendLoginCode: publicRateLimitedProcedure
      .input(insertUserParams)
      .mutation(async ({ input: { email }, ctx: { db, emails } }) => {
         const [createdUser] = await db
            .insert(users)
            .values({
               email,
            })
            .returning({ id: users.id })
            .onConflictDoNothing({ target: users.email })

         const [existingUser] = !createdUser
            ? await db.select().from(users).where(eq(users.email, email))
            : []

         if (!existingUser && !createdUser)
            throw new TRPCError({
               message: "Error, couldn't create account",
               code: "INTERNAL_SERVER_ERROR",
            })

         const user = createdUser ?? existingUser

         if (!user)
            throw new TRPCError({
               code: "INTERNAL_SERVER_ERROR",
               message: "Unknown error occurred",
            })

         const res = await db.transaction(async (tx) => {
            const verificationCode = await generateEmailVerificationCode({
               tx,
               userId: user.id,
               email,
            })

            if (env.NODE_ENV === "development") {
               console.log("CODE:", verificationCode)
               return { userId: user.id }
            }

            const res = await emails.emails.send({
               from: EMAIL_FROM,
               to: email,
               subject: `Acme verification code`,
               react: VerificationCodeEmail({
                  verificationCode,
               }),
            })

            if (res.error)
               throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "An error occurred, couldn't send email",
               })

            return { userId: user.id }
         })

         return res
      }),
   verifyLoginCode: publicProcedure
      .input(verifyLoginCodeParams)
      .mutation(async ({ input: { code, userId }, ctx: { db } }) => {
         const validCode = await verifyVerificationCode(db, userId, code)
         if (!validCode)
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "Code you entered is invalid or expired",
            })

         await lucia.invalidateUserSessions(userId)
         await db
            .update(users)
            .set({ emailVerified: true })
            .where(eq(users.id, userId))

         const session = await lucia.createSession(userId, {})
         const sessionCookie = lucia.createSessionCookie(session.id)
         return sessionCookie
      }),
})

const verifyVerificationCode = async (
   db: typeof database,
   userId: string,
   code: string
) => {
   let isValid = true

   const databaseCode = await db.transaction(async (tx) => {
      const [databaseCode] = await tx
         .select()
         .from(emailVerificationCodes)
         .where(eq(emailVerificationCodes.userId, userId))

      if (!databaseCode || databaseCode.code !== code) {
         isValid = false
      }

      if (databaseCode && !isWithinExpirationDate(databaseCode.expiresAt)) {
         isValid = false
      }

      if (databaseCode?.userId !== userId) {
         isValid = false
      }

      return databaseCode
   })

   if (databaseCode) {
      await db
         .delete(emailVerificationCodes)
         .where(eq(emailVerificationCodes.id, databaseCode.id))
   }

   return isValid
}
