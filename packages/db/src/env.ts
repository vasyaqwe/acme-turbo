import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
   shared: {
      NODE_ENV: z
         .enum(["development", "production", "test"])
         .default("development"),
   },
   /**
    * Specify your server-side environment variables schema here.
    * This way you can ensure the app isn't built with invalid env vars.
    */
   clientPrefix: "NEXT_PUBLIC_",
   client: {},
   server: {
      DATABASE_URL: z.string().min(1),
   },
   /**
    * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
    */
   runtimeEnvStrict: {
      NODE_ENV: process.env.NODE_ENV,

      DATABASE_URL: process.env.DATABASE_URL,
   },
   skipValidation:
      !!process.env.CI ||
      !!process.env.SKIP_ENV_VALIDATION ||
      process.env.npm_lifecycle_event === "lint",
})
