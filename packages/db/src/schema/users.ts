import {
   boolean,
   index,
   text,
   timestamp,
   uniqueIndex,
   uuid,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { createTable, id, lifecycleDates } from "../utils"

export const users = createTable(
   "users",
   {
      id,
      email: text("email"),
      firstName: text("first_name"),
      avatarUrl: text("avatar_url"),
      emailVerified: boolean("email_verified").notNull().default(false),
      ...lifecycleDates,
   },
   (table) => {
      return {
         emailIdx: uniqueIndex("email_idx").on(table.email),
      }
   }
)

export const oauthAccounts = createTable(
   "oauth_accounts",
   {
      userId: uuid("user_id")
         .primaryKey()
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      providerId: text("provider_id"),
      providerUserId: text("provider_user_id"),
   },
   (table) => {
      return {
         providerIdIdx: index("provider_id_idx").on(table.providerId),
         providerUserIdIdx: index("provider_user_id_idx").on(
            table.providerUserId
         ),
      }
   }
)

export const emailVerificationCodes = createTable(
   "email_verification_codes",
   {
      id,
      expiresAt: timestamp("expires_at", {
         withTimezone: true,
         mode: "date",
      }).notNull(),
      code: text("code").notNull(),
      userId: uuid("user_id").notNull(),
      email: text("email").notNull().unique(),
   },
   (table) => {
      return {
         emailVerificationCodeUserIdIdx: index(
            "email_verification_code_user_id_idx"
         ).on(table.userId),
      }
   }
)

export const sessions = createTable("sessions", {
   id: text("id").primaryKey(),
   expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
   }).notNull(),
   userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
})

export const selectUserParams = createSelectSchema(users)
export const insertUserParams = z.object({
   email: z.string().email(),
})
export const verifyLoginCodeParams = createInsertSchema(
   emailVerificationCodes
).pick({
   code: true,
   userId: true,
})

export type User = z.infer<typeof selectUserParams>
export type SendLoginCodeParams = z.infer<typeof insertUserParams>
export type VerifyLoginCodeParams = z.infer<typeof verifyLoginCodeParams>
