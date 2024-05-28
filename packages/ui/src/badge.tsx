import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "."

const badgeVariants = cva(
   "inline-block inline-flex min-h-[26px] items-center justify-center rounded-full border px-2 font-medium leading-none",
   {
      variants: {
         variant: {
            default: `border-primary/10 bg-accent bg-primary/15 text-accent-foreground text-primary`,
            destructive:
               "bg-rose-400/20 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400",
            error: "!h-auto gap-2 bg-rose-400/20 px-2 py-1.5 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400",
            success:
               "bg-lime-400/20 text-lime-700 dark:bg-lime-400/10 dark:text-lime-400",
            positive: "bg-positive/20 text-positive",
            neutral: "bg-neutral/20 text-neutral",
            negative: "bg-negative/20 text-negative",
         },
         size: {
            default: "h-7 px-2",
            sm: "h-6 rounded-sm",
            lg: "h-10 rounded-md px-8",
            icon: "size-6 justify-center gap-0 px-1",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   }
)

export interface BadgeProps
   extends React.HTMLAttributes<HTMLSpanElement>,
      VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
   ({ className, variant, size, ...props }, ref) => {
      const Comp = "span"
      return (
         <Comp
            className={cn(badgeVariants({ variant, size, className }))}
            ref={ref}
            {...props}
         />
      )
   }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
