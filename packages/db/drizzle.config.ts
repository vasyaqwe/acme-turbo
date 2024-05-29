import type { Config } from "drizzle-kit"
import { env } from "./src/env"

const url = env.DATABASE_URL

export default {
   schema: "./src/schema/**/*.ts",
   dialect: "postgresql",
   dbCredentials: { url },
   tablesFilter: ["acme_*"],
} satisfies Config
