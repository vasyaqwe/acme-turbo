"use server"

import { action } from "@/lib/utils"
import { caller } from "@/trpc/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const githubLoginAction = async () => {
   const { url } = await caller.user.githubLogin()
   redirect(url)
}

export const googleLoginAction = async () => {
   const { url } = await caller.user.googleLogin()
   redirect(url)
}

export const verifyLoginCodeAction = action(
   caller.user.verifyLoginCode,
   (sessionCookie) => {
      cookies().set(
         sessionCookie.name,
         sessionCookie.value,
         sessionCookie.attributes
      )
   }
)
