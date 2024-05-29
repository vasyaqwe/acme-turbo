"use client"

import type Error from "next/error"
import { ErrorDisplay } from "@/components/error"

export default function GlobalError({
   error,
   reset,
}: {
   error: Error
   reset: () => void
}) {
   return (
      <html>
         <body>
            <main>
               <ErrorDisplay
                  error={error}
                  reset={reset}
               />
            </main>
         </body>
      </html>
   )
}
