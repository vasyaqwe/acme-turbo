import * as crypto from "crypto"
import { pgTableCreator, timestamp, uuid } from "drizzle-orm/pg-core"

export const randomUUID = crypto.randomUUID
export const createTable = pgTableCreator((name) => `acme_${name}`)

export const lifecycleDates = {
   createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
   updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
}

export const id = uuid("id")
   .primaryKey()
   .$defaultFn(() => randomUUID())
