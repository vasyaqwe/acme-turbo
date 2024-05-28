import type { Config } from "drizzle-kit"

const url = process.env.DATABASE_URL

if (!url) {
   throw new Error("Missing DATABASE_URL")
}

export default {
   schema: "./src/schema/**/*.ts",
   dialect: "postgresql",
   dbCredentials: { url },
   tablesFilter: ["acme_*"],
} satisfies Config
