import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { type ComponentPropsWithRef } from "react"

export const Link = (props: ComponentPropsWithRef<typeof NextLink>) => {
   const router = useRouter()
   const strHref = typeof props.href === "string" ? props.href : props.href.href

   const conditionalPrefetch = () => {
      if (typeof props.prefetch === "boolean") return

      if (strHref) {
         void router.prefetch(strHref as unknown as never)
      }
   }

   return (
      <NextLink
         {...props}
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
