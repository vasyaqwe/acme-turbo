"use client"

import { Avatar, AvatarFallback } from "./avatar"
import Image from "next/image"
import { type AvatarProps } from "@radix-ui/react-avatar"
import { cn } from "."
import { type User } from "@acme/db/schema/users"

type UserAvatarProps = AvatarProps & {
   user: Partial<User>
   showActiveIndicator?: boolean
   size?: number
}

export function UserAvatar({
   user,
   className,
   size = 60,
   ...props
}: UserAvatarProps) {
   return (
      <Avatar
         {...props}
         className={cn(
            "block size-9 overflow-visible text-lg",
            !user.avatarUrl ? "" : "",
            className
         )}
      >
         {user.avatarUrl ? (
            <Image
               width={size}
               height={size}
               src={user.avatarUrl}
               alt={`${user.firstName}'s avatar`}
               referrerPolicy="no-referrer"
               className={cn(
                  "h-[inherit] w-full rounded-full object-cover object-top"
               )}
            />
         ) : (
            <AvatarFallback
               className={cn(
                  "bg-background text-foreground/75 shadow-[inset_-1px_1px_2px_1px_hsl(210_12%_75%)] dark:shadow-[inset_-1px_1px_1px_0px_hsl(0_0%_70%)]",
                  className
               )}
            >
               {user.firstName && user.firstName !== ""
                  ? user.firstName[0]?.toUpperCase()
                  : user.email?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
         )}
      </Avatar>
   )
}
