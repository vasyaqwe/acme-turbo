import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

import base from "./base"

export default {
   content: base.content,
   presets: [base],
   theme: {
      container: {
         center: true,
         padding: "1.25rem",
         screens: {
            sm: "100%",
            md: "100%",
            lg: "984px",
            xl: "1024px",
            "2xl": "1268px",
         },
      },
   },
   plugins: [animate],
} satisfies Config
