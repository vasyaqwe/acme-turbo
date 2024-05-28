import { cn } from "."

function Skeleton({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) {
   return (
      <div
         className={cn(
            `relative overflow-hidden rounded-md bg-border/50 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] 
            before:bg-gradient-to-r before:from-transparent before:via-border before:to-transparent`,
            className
         )}
         {...props}
      />
   )
}

export { Skeleton }
