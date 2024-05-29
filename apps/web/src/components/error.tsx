import { Button, buttonVariants } from "@acme/ui/button"
import { XCircleIcon } from "@heroicons/react/24/outline"
import type Error from "next/error"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { DottedBg } from "@acme/ui/dotted-bg"

export function ErrorDisplay({ reset }: { error: Error; reset: () => void }) {
   const router = useRouter()

   return (
      <div className="grid h-svh place-content-center">
         <DottedBg />
         <div className="container space-y-4 text-center">
            <XCircleIcon className="mx-auto size-16 stroke-red-500" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-lg">
               Sorry, we're experiencing technical difficulties.
            </p>
            <div className="flex items-center justify-center gap-2">
               <Button
                  onClick={() => {
                     startTransition(() => {
                        router.refresh()
                        reset()
                     })
                  }}
               >
                  Retry
               </Button>
               <Link
                  className={buttonVariants({ variant: "outline" })}
                  href={"/"}
               >
                  Go to homepage
               </Link>
            </div>
         </div>
      </div>
   )
}
