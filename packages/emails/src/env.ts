import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
   /**
    * Specify your server-side environment variables schema here.
    * This way you can ensure the app isn't built with invalid env vars.
    */
   server: {
      RESEND_API_KEY: z.string().min(1),
   },
   /**
    * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
    */
   runtimeEnvStrict: {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
   },
   skipValidation:
      !!process.env.CI ||
      !!process.env.SKIP_ENV_VALIDATION ||
      process.env.npm_lifecycle_event === "lint",
})
