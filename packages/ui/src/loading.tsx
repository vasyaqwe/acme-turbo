import { cn } from "."
import { type ComponentProps } from "react"

export function Loading({ className, ...props }: ComponentProps<"div">) {
   return (
      <div
         data-visible={true}
         className={cn("sonner-loading-wrapper !relative", className)}
         {...props}
      >
         <div className="sonner-spinner [--size:1.3rem]">
            {Array(12)
               .fill(0)
               .map((_, idx) => (
                  <div
                     style={{ background: "unset" }}
                     className="sonner-loading-bar !bg-current"
                     key={idx}
                  />
               ))}
         </div>
      </div>
   )
}
