import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { type ComponentPropsWithRef } from "react"

export const Link = (props: ComponentPropsWithRef<typeof NextLink>) => {
   const router = useRouter()
   return (
      <NextLink
         {...props}
         onMouseEnter={(e) => {
            const href =
               typeof props.href === "string" ? props.href : props.href.href
            if (href) {
               router.prefetch(href)
            }
            return props.onMouseEnter?.(e)
         }}
      />
   )
}
