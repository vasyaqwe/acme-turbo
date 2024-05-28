import { cn } from "."
import { forwardRef, type ComponentProps } from "react"

const Card = forwardRef<HTMLDivElement, ComponentProps<"div">>(
   ({ className, ...props }, ref) => (
      <div
         ref={ref}
         className={cn(`shadow-shadow rounded-lg bg-popover p-8`, className)}
         {...props}
      />
   )
)

export { Card }
