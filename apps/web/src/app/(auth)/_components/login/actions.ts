"use server"

import { action } from "@/lib/utils"
import { serverCaller } from "@/trpc/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const githubLoginAction = async () => {
   const { url } = await serverCaller.user.githubLogin()
   redirect(url)
}

export const googleLoginAction = async () => {
   const { url } = await serverCaller.user.googleLogin()
   redirect(url)
}

export const verifyLoginCodeAction = action(
   serverCaller.user.verifyLoginCode,
   (sessionCookie) => {
      cookies().set(
         sessionCookie.name,
         sessionCookie.value,
         sessionCookie.attributes
      )
   }
)
