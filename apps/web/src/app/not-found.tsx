"use client"

import { cn } from "@acme/ui"
import { DottedBg } from "@acme/ui/dotted-bg"
import { buttonVariants } from "@acme/ui/button"
import Link from "next/link"

export const metadata = {
   title: "Acme › Page not found",
}

export default function NotFound() {
   return (
      <div className="grid h-svh w-full place-content-center gap-3 text-center">
         <DottedBg />
         <p className="text-center text-2xl font-bold">Acme</p>
         <h1 className="text-4xl font-bold">404</h1>
         <p>This page could not be found.</p>
         <Link
            className={cn(buttonVariants(), "mt-2")}
            href={`/`}
         >
            Back to homepage
         </Link>
      </div>
   )
}
