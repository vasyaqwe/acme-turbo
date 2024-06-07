import { Resend } from "resend"
import { env } from "./env"

export const EMAIL_FROM = "Acme <acme@vasyldev.cc>"
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const emails = new Resend(env.RESEND_API_KEY ?? "re_123")
