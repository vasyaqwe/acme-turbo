"use client"

import { Badge } from "@acme/ui/badge"
import { TableCell, TableRow } from "@acme/ui/table"
import { expenseNamesColors } from "@acme/db/schema/expenses"
import { api } from "@/trpc/react"
import { type CSSProperties } from "react"
import { formatCurrency } from "@/lib/utils"

export function Expenses() {
   const [expenses] = api.expense.list.useSuspenseQuery()

   return (
      <>
         {expenses.map((expense) => (
            <TableRow
               className="w-[100px]"
               key={expense.id}
            >
               <TableCell className="capitalize">
                  <Badge
                     style={
                        {
                           "--primary": expenseNamesColors[expense.name],
                        } as CSSProperties
                     }
                  >
                     {expense.name}
                  </Badge>
               </TableCell>
               <TableCell className="text-right">
                  {formatCurrency(expense.amount)}
               </TableCell>
            </TableRow>
         ))}
      </>
   )
}
