import * as React from "react"
import { cn } from "."

const Table = React.forwardRef<
   HTMLTableElement,
   React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
   <div className="relative w-full overflow-auto rounded-md bg-muted/60">
      <table
         ref={ref}
         className={cn("w-full caption-bottom text-[0.9125rem]", className)}
         {...props}
      />
   </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
   HTMLTableSectionElement,
   React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
   <thead
      ref={ref}
      className={cn(
         "[&>tr]:bottom-0 [&>tr]:mt-1 [&>tr]:!border-0 [&>tr]:bg-transparent [&>tr]:before:h-0",
         className
      )}
      {...props}
   >
      {children}
   </thead>
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
   HTMLTableSectionElement,
   React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
   <tbody
      ref={ref}
      className={cn(
         `isolate before:absolute before:inset-1 before:top-12 before:z-[-1] before:rounded-md before:border before:bg-popover before:shadow-md`,
         className
      )}
      {...props}
   >
      {children}
   </tbody>
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
   HTMLTableSectionElement,
   React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
   <tfoot
      ref={ref}
      className={cn(
         "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
         className
      )}
      {...props}
   />
))
TableFooter.displayName = "TableFooter"

const TableHead = React.forwardRef<
   HTMLTableCellElement,
   React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
   <th
      ref={ref}
      className={cn(
         "h-11 px-4 pt-1 text-left align-middle text-[1.025rem] font-medium leading-none text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
         className
      )}
      {...props}
   />
))
TableHead.displayName = "TableHead"

const TableRow = React.forwardRef<
   HTMLTableRowElement,
   React.HTMLAttributes<HTMLTableRowElement>
>(({ className, children, ...props }, ref) => (
   <tr
      ref={ref}
      className={cn(
         `relative transition-colors before:absolute before:inset-0 before:bottom-0 before:z-[1] before:mx-auto before:h-px before:w-[calc(100%-2.25rem)] before:bg-border first:before:h-0 data-[state=selected]:bg-muted [&:first-child>td>div]:mt-1 [&:last-child>td>div]:mb-1`,
         //        [&:first-child>div]:border-t
         //   [&:first-child>td:first-child>div]:rounded-tl-md
         //   [&:first-child>td:last-child>div]:rounded-tr-md
         //   [&:first-child>td>div]:border-t
         //   [&:last-child>td:first-child>div]:rounded-bl-md
         //   [&:last-child>td:last-child>div]:rounded-br-md
         //   [&:last-child>td>div]:border-b
         //   [&>td:first-child>div]:ml-1
         //   [&>td:last-child>div]:mr-1
         className
      )}
      {...props}
   >
      {children}
   </tr>
))
TableRow.displayName = "TableRow"

const TableCell = React.forwardRef<
   HTMLTableCellElement,
   React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
   <td
      ref={ref}
      className={cn(
         `align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]`,
         className
      )}
      {...props}
   >
      <div className="px-4 py-3">{children}</div>
   </td>
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
   HTMLTableCaptionElement,
   React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
   <caption
      ref={ref}
      className={cn("mt-4 text-muted-foreground", className)}
      {...props}
   />
))
TableCaption.displayName = "TableCaption"

export {
   Table,
   TableHeader,
   TableBody,
   TableFooter,
   TableHead,
   TableRow,
   TableCell,
   TableCaption,
}
