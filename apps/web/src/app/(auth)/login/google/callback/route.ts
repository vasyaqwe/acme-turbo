import { OAuth2RequestError } from "arctic"
import { and, eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { google, lucia } from "@acme/auth"
import { db } from "@acme/db/client"
import { oauthAccounts, users } from "@acme/db/schema/users"

type GoogleUser = {
   id: string
   email: string
   verified_email: boolean
   name?: string
   given_name: string
   picture: string
   locale: string
}

export async function GET(request: Request) {
   const url = new URL(request.url)
   const code = url.searchParams.get("code")
   const state = url.searchParams.get("state")
   const codeVerifier = cookies().get("google_code_verifier")?.value ?? null
   const storedState = cookies().get("state")?.value ?? null

   if (
      !code ||
      !codeVerifier ||
      !state ||
      !storedState ||
      state !== storedState
   ) {
      return new Response(null, {
         status: 400,
      })
   }

   try {
      const tokens = await google.validateAuthorizationCode(code, codeVerifier)
      const googleResponse = await fetch(
         "https://www.googleapis.com/oauth2/v1/userinfo",
         {
            headers: {
               Authorization: `Bearer ${tokens.accessToken}`,
            },
         }
      )
      const googleUser = (await googleResponse.json()) as GoogleUser

      const [existingUser] = await db
         .select({ userId: oauthAccounts.userId })
         .from(oauthAccounts)
         .where(
            and(
               eq(oauthAccounts.providerId, "google"),
               eq(oauthAccounts.providerUserId, googleUser.id)
            )
         )

      if (existingUser) {
         const session = await lucia.createSession(existingUser.userId, {})
         const sessionCookie = lucia.createSessionCookie(session.id)
         cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
         )
         return new Response(null, {
            status: 302,
            headers: {
               Location: "/",
            },
         })
      }

      const createdUser = await db.transaction(async (tx) => {
         const [createdUser] = await tx
            .insert(users)
            .values({
               email: googleUser.email,
               firstName: googleUser.name ?? googleUser.given_name,
               avatarUrl: googleUser.picture,
               emailVerified: googleUser.verified_email,
            })
            .returning({ id: users.id })

         if (!createdUser) throw new Error("Unknown error occurred")

         await tx.insert(oauthAccounts).values({
            userId: createdUser.id,
            providerId: "google",
            providerUserId: googleUser.id,
         })

         return createdUser
      })

      const session = await lucia.createSession(createdUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
         sessionCookie.name,
         sessionCookie.value,
         sessionCookie.attributes
      )

      return new Response(null, {
         status: 302,
         headers: {
            Location: "/",
         },
      })
   } catch (e) {
      if (
         e instanceof OAuth2RequestError &&
         e.message === "bad_verification_code"
      ) {
         // invalid code
         return new Response(null, {
            status: 400,
         })
      }
      return new Response(null, {
         status: 500,
      })
   }
}
