"use client"

import { pushModal } from "@/components/modals"
import { Button } from "@acme/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"

function getTimeOfDay() {
   const hour = new Date().getHours()

   if (hour >= 5 && hour < 12) {
      return "Morning"
   } else if (hour >= 12 && hour < 17) {
      return "Afternoon"
   } else if (hour >= 17 && hour < 21) {
      return "Evening"
   } else {
      return "Night"
   }
}

export function Intro() {
   return (
      <div className="flex w-full items-center justify-between">
         <h1
            suppressHydrationWarning
            className="text-xl font-bold md:text-2xl"
         >
            {getTimeOfDay()}, welcome to Acme
         </h1>
         <Button onClick={() => pushModal("create-expense")}>
            New expense{" "}
            <PlusIcon
               className="size-5 flex-shrink-0"
               strokeWidth={2.5}
            />
         </Button>
      </div>
   )
}
