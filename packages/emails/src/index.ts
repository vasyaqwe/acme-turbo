import { Resend } from "resend"
import { env } from "./env"

export const EMAIL_FROM = "Acme <acme@vasyldev.cc>"
export const emails = new Resend(env.RESEND_API_KEY)
