/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-restricted-properties */
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as expenses from "./schema/expenses"
import * as users from "./schema/users"
import { env } from "./env"

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
   conn: postgres.Sql | undefined
}

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL)
if (env.NODE_ENV !== "production") globalForDb.conn = conn

export const db = drizzle(conn, { schema: { ...expenses, ...users } })
