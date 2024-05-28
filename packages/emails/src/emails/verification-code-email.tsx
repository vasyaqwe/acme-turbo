import React from "react"
import {
   Head,
   Html,
   Img,
   Preview,
   Section,
   Text,
} from "@react-email/components"

import { EmailBody } from "../emails/shared"
import { withBaseUrl } from "../utils"

export function VerificationCodeEmail({
   verificationCode,
}: {
   verificationCode: string
}) {
   return (
      <Html>
         <Head />
         <Preview>Acme verification code</Preview>
         <EmailBody>
            <Section className="mt-[12px]">
               <Img
                  src={withBaseUrl("/logo.png")}
                  width="42"
                  height="42"
                  alt="Acme"
                  className="my-0"
               />
            </Section>

            <Text className="mx-0 my-[30px] p-0 text-[24px] font-normal text-black">
               Your Acme verification code
            </Text>

            <Text className="text-[28px] font-bold leading-[24px] tracking-widest text-black">
               {verificationCode}
            </Text>
            <Text className="text-[14px] leading-[24px] text-gray-700">
               The code will expire in 15 minutes.
            </Text>
         </EmailBody>
      </Html>
   )
}
