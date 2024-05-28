import type { Config } from "tailwindcss"

export default {
   darkMode: ["class"],
   content: ["src/**/*.{ts,tsx}"],
   theme: {
      extend: {
         animation: {
            "caret-blink": "caret-blink 1.25s ease-out infinite",
            "fade-in":
               "fade-in 450ms var(--animation-delay, 0ms) ease forwards",
         },
         keyframes: {
            shimmer: {
               "100%": {
                  transform: "translateX(100%)",
               },
            },
            "caret-blink": {
               "0%,70%,100%": { opacity: "1" },
               "20%,50%": { opacity: "0" },
            },
            "fade-in": {
               from: { opacity: "0" },
               to: { opacity: "1" },
            },
         },
         transitionTimingFunction: {
            smoothing: "cubic-bezier(0.32, 0.73, 0, 1)",
         },
         colors: {
            border: "hsl(var(--border))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            popover: "hsl(var(--popover))",
            primary: {
               DEFAULT: "hsl(var(--primary))",
            },
            secondary: "hsl(var(--secondary))",
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
               DEFAULT: "hsl(var(--accent))",
               foreground: "hsl(var(--accent-foreground))",
            },
         },
         fontSize: {
            base: "0.9275rem",
         },
         borderRadius: {
            "3xl": `calc(var(--radius) + 24px)`,
            "2xl": `calc(var(--radius) + 10px)`,
            xl: `calc(var(--radius) + 4px)`,
            lg: `var(--radius)`,
            md: `calc(var(--radius) - 4px)`,
            sm: "calc(var(--radius) - 6px)",
         },
         boxShadow: {
            button:
               "0px 0px 0px 0.5px hsl(var(--background)/.2),0px 1px 1px -1px hsl(var(--background)/.2),0px 2px 2px -1px hsl(var(--background)/.2),inset 0px 0.5px 0px hsla(0,0%,100%,.0),inset 0px 0px 1px 0px hsla(0,0%,100%,0),inset 0px -6px 12px -4px hsl(var(--background)/.2)",
            shadow: "var(--shadow)",
         },
      },
   },
} satisfies Config
