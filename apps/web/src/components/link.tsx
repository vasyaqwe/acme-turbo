"use client"

import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { type ComponentPropsWithRef } from "react"

export const Link = (props: ComponentPropsWithRef<typeof NextLink>) => {
   const router = useRouter()
   const strHref = typeof props.href === "string" ? props.href : props.href.href

   const conditionalPrefetch = () => {
      //don't prefetch on mouseEnter if prefetching on viewport enter
      if (props.prefetch === true) return

      if (strHref) {
         void router.prefetch(strHref)
      }
   }

   return (
      <NextLink
         {...props}
         //if true, prefetch on entering viewport, else disable for viewport and prefetch on mouseEnter
         prefetch={props.prefetch === true ? true : false}
         onMouseEnter={(e) => {
            conditionalPrefetch()
            return props.onMouseEnter?.(e)
         }}
         onPointerEnter={(e) => {
            conditionalPrefetch()
            return props.onPointerEnter?.(e)
         }}
         onTouchStart={(e) => {
            conditionalPrefetch()
            return props.onTouchStart?.(e)
         }}
         onFocus={(e) => {
            conditionalPrefetch()
            return props.onFocus?.(e)
         }}
      />
   )
}
