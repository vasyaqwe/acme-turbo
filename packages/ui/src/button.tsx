import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "."
import { type ComponentProps, forwardRef } from "react"

const buttonVariants = cva(
   `relative inline-flex items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap font-medium shadow-button ring-offset-background transition-colors before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-b before:from-background/[0.18] before:opacity-0 before:transition-opacity hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-85`,
   {
      variants: {
         variant: {
            default: `bg-primary text-background`,
            accent: `bg-accent text-accent-foreground hover:bg-accent/80`,
            outline: `bg-popover shadow-shadow before:from-foreground/[0.015]`,
            link: "!h-auto !rounded-none !p-0 underline before:hidden hover:no-underline",
         },
         size: {
            default: "h-[35px] rounded-md px-3 before:rounded-md",
            sm: "h-8 rounded-sm px-2.5 text-sm",
            lg: "h-9 px-8",
            icon: "size-8 gap-0 rounded-md",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   }
)

type ButtonProps = ComponentProps<"button"> &
   VariantProps<typeof buttonVariants>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, variant, size, ...props }, ref) => {
      return (
         <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
         />
      )
   }
)

export { Button, buttonVariants, type ButtonProps }
