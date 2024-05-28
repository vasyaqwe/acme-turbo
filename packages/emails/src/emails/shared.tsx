import React from "react"
import { Body, Button, Container, Tailwind } from "@react-email/components"

function EmailButton({
   href,
   children,
}: {
   href: string
   children: React.ReactNode
}) {
   return (
      <Button
         target="_blank"
         href={href}
         className="rounded-md bg-[#3b8ffc] px-5 py-2 text-[14px] font-semibold text-white no-underline"
      >
         {children}
      </Button>
   )
}
function EmailBody({ children }: { children: React.ReactNode }) {
   return (
      <Tailwind>
         <Body
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
            className="mx-auto my-auto px-2"
         >
            <Container className="mx-auto my-[40px] max-w-[465px] rounded-md px-[20px] py-[50px]">
               {children}
            </Container>
         </Body>
      </Tailwind>
   )
}
export { EmailButton, EmailBody }
