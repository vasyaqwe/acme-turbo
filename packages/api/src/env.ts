import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
   server: {
      UNKEY_ROOT_KEY: z.string().min(1),
   },
   runtimeEnvStrict: {
      UNKEY_ROOT_KEY: process.env.UNKEY_ROOT_KEY,
   },
   skipValidation:
      !!process.env.CI ||
      !!process.env.SKIP_ENV_VALIDATION ||
      process.env.npm_lifecycle_event === "lint",
})
