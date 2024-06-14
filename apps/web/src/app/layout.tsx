import type { Metadata, Viewport } from "next"
import { TRPCReactProvider } from "@/trpc/react"
import { Inter } from "next/font/google"
import { cn } from "@acme/ui"
import { Toaster } from "@acme/ui/toast"
import "@/app/globals.css"
import { env } from "@/env"

export const metadata: Metadata = {
   metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
   title: "Acme Turbo",
   description: "T3 Turborepo template",
   openGraph: {
      title: "Acme Turbo",
      description: "T3 Turborepo template",
      url: new URL(env.NEXT_PUBLIC_BASE_URL),
      siteName: "Acme Turbo",
   },
}

export const viewport: Viewport = {
   themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
   ],
   initialScale: 1,
   maximumScale: 1,
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function RootLayout(props: { children: React.ReactNode }) {
   return (
      <html
         lang="en"
         suppressHydrationWarning
         className={cn("font-primary text-base antialiased", inter.variable)}
      >
         <body className="bg-background text-foreground">
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
            <Toaster />
         </body>
      </html>
   )
}
