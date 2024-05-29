import { cache } from "react"
import { cookies } from "next/headers"
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { GitHub, Google } from "arctic"
import { eq } from "drizzle-orm"
import { Lucia, TimeSpan } from "lucia"
import { createDate } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"

import { db } from "@acme/db/client"
import {
   emailVerificationCodes,
   sessions,
   type User,
   users,
} from "@acme/db/schema/users"

import { env } from "./env"

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET)
export const google = new Google(
   env.GOOGLE_CLIENT_ID,
   env.GOOGLE_CLIENT_SECRET,
   env.NEXT_PUBLIC_BASE_URL + "/login/google/callback"
)

export const initLucia = () => {
   const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

   const lucia = new Lucia(adapter, {
      sessionCookie: {
         attributes: {
            secure: env.NODE_ENV === "production",
         },
      },
      getUserAttributes: (attributes) => {
         return {
            id: attributes.id,
            email: attributes.email,
            avatarUrl: attributes.avatarUrl,
            firstName: attributes.firstName,
            emailVerified: attributes.emailVerified,
         }
      },
   })

   return lucia
}

export const lucia = initLucia()

export const uncachedGetAuthSession = async () => {
   const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
   if (!sessionId) return { user: null, session: null }

   const { session, user } = await lucia.validateSession(sessionId)
   // next.js throws when you attempt to set cookie when rendering page
   try {
      if (session?.fresh) {
         const sessionCookie = lucia.createSessionCookie(session.id)
         cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
         )
      }
      if (!session) {
         const sessionCookie = lucia.createBlankSessionCookie()
         cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
         )
      }
   } catch {
      console.error("Failed to set session cookie")
   }

   return { user, session }
}

export const getAuthSession = cache(uncachedGetAuthSession)

export const generateEmailVerificationCode = async ({
   tx,
   userId,
   email,
}: {
   tx: typeof db
   userId: string
   email: string
}) => {
   await tx
      .delete(emailVerificationCodes)
      .where(eq(emailVerificationCodes.email, email))

   const code = generateRandomString(6, alphabet("0-9"))

   await tx.insert(emailVerificationCodes).values({
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")), // 5 minutes
   })

   return code
}

export type Session = Awaited<ReturnType<typeof getAuthSession>>

declare module "lucia" {
   interface Register {
      Lucia: typeof lucia
      DatabaseUserAttributes: User
   }
}
