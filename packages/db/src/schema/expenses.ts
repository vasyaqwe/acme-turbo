import { integer, pgEnum, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { type z } from "zod"
import { users } from "./users"
import { createTable, id, lifecycleDates } from "../utils"

export const expenseNames = [
   "rent",
   "utilities",
   "groceries",
   "entertainment",
   "clothing",
   "transportation",
   "health",
   "insurance",
   "other",
] as const

export const expenseNamesColors: Record<ExpenseName, string> = {
   rent: "350 89% 60%",
   utilities: "293 69% 49%",
   groceries: "38 92% 50%",
   entertainment: "258 90% 66%",
   clothing: "0 56% 47%",
   transportation: "194 96% 42%",
   health: "45 93% 47%",
   insurance: "142 71% 45%",
   other: "292 84% 61%",
}

export const expenseName = pgEnum("name", expenseNames)

export const expenses = createTable("expenses", {
   id,
   userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
   amount: integer("amount").notNull(),
   name: expenseName("name").notNull(),
   ...lifecycleDates,
})

export const selectExpensesSchema = createSelectSchema(expenses)
export const insertExpenseParams = createInsertSchema(expenses).omit({
   userId: true,
})

export type ExpenseName = (typeof expenseNames)[number]
export type Expense = z.infer<typeof selectExpensesSchema>
