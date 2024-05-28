import { Resend } from "resend"

export const EMAIL_FROM = "Acme <acme@vasyldev.cc>"
export const emails = new Resend(process.env.RESEND_API_KEY)
