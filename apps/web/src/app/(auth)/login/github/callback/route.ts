import { OAuth2RequestError } from "arctic"
import { and, eq } from "drizzle-orm"
import { cookies } from "next/headers"

import { github, lucia } from "@acme/auth"
import { db } from "@acme/db/client"
import { oauthAccounts, users } from "@acme/db/schema/users"

export async function GET(request: Request) {
   const url = new URL(request.url)
   const code = url.searchParams.get("code")
   const state = url.searchParams.get("state")
   const storedState = cookies().get("github_oauth_state")?.value ?? null

   if (!code || !state || !storedState || state !== storedState)
      return new Response(null, {
         status: 400,
      })

   try {
      const tokens = await github.validateAuthorizationCode(code)
      const githubResponse = await fetch("https://api.github.com/user", {
         headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
         },
      })
      const githubUser = (await githubResponse.json()) as {
         id: number
         login: string // username
      }

      const [existingUser] = await db
         .select({ userId: oauthAccounts.userId })
         .from(oauthAccounts)
         .where(
            and(
               eq(oauthAccounts.providerId, "github"),
               eq(oauthAccounts.providerUserId, githubUser.id.toString())
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
               firstName: githubUser.login,
            })
            .returning({ id: users.id })

         if (!createdUser) throw new Error("Unknown error occurred")

         await tx.insert(oauthAccounts).values({
            userId: createdUser.id,
            providerId: "github",
            providerUserId: githubUser.id.toString(),
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
