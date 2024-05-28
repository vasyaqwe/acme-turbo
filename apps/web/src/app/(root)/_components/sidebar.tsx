"use client"

import { Link } from "@/components/link"
import { buttonVariants } from "@acme/ui/button"
import { UserAvatar } from "@acme/ui/user-avatar"
import { api } from "@/trpc/react"
import {
   CircleStackIcon,
   InboxStackIcon,
   RectangleGroupIcon,
} from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import { cn } from "@acme/ui"

export function Sidebar() {
   const pathname = usePathname()
   const [user] = api.user.me.useSuspenseQuery()
   if (!user) return null

   return (
      <aside className="w-72 p-6 max-md:hidden">
         <header className="flex items-center justify-between">
            <Link
               href="/"
               className="text-2xl font-bold"
            >
               Acme
            </Link>
            <UserAvatar user={user} />
         </header>
         <nav className="mt-6">
            <ul className="flex flex-col gap-2">
               <li>
                  <Link
                     className={cn(
                        pathname === "/"
                           ? buttonVariants({ variant: "outline" })
                           : `${buttonVariants()} bg-transparent`,
                        "w-full justify-start text-foreground backdrop-blur-md transition-all hover:bg-popover hover:shadow-shadow aria-[current=page]:hover:before:from-foreground/[0.015]"
                     )}
                     href={"/"}
                  >
                     <RectangleGroupIcon className="size-5" />
                     Dashboard
                  </Link>
               </li>
               <li>
                  <Link
                     className={cn(
                        pathname === "/whatever"
                           ? buttonVariants({ variant: "outline" })
                           : `${buttonVariants()} bg-transparent`,
                        "w-full justify-start text-foreground backdrop-blur-md transition-all hover:bg-popover hover:shadow-shadow aria-[current=page]:hover:before:from-foreground/[0.015]"
                     )}
                     href={"/whatever"}
                  >
                     <InboxStackIcon className="size-5" />
                     Whatevers
                  </Link>
               </li>
               <li>
                  <Link
                     className={cn(
                        `${buttonVariants()} bg-transparent`,
                        "w-full justify-start text-foreground backdrop-blur-md transition-all hover:bg-popover hover:shadow-shadow aria-[current=page]:hover:before:from-foreground/[0.015]"
                     )}
                     href={"/"}
                  >
                     <CircleStackIcon className="size-5" />
                     Something
                  </Link>
               </li>
            </ul>
         </nav>
      </aside>
   )
}
