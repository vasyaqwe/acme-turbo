"use server"

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
export const verifyLoginCodeAction = async (
   input: Parameters<typeof serverCaller.user.verifyLoginCode>[0]
) => {
   const sessionCookie = await serverCaller.user.verifyLoginCode(input)
   cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
   )
}
