"use server"

import { api } from "@/trpc/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const githubLoginAction = async () => {
   const { url } = await api.user.githubLogin()
   redirect(url)
}
export const googleLoginAction = async () => {
   const { url } = await api.user.googleLogin()
   redirect(url)
}
export const verifyLoginCodeAction = async (
   input: Parameters<typeof api.user.verifyLoginCode>[0]
) => {
   const sessionCookie = await api.user.verifyLoginCode(input)
   cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
   )
}
