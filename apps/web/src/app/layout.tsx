import type { Metadata, Viewport } from "next"
import { TRPCReactProvider } from "@/trpc/react"
import { Inter } from "next/font/google"

import { cn } from "@acme/ui"
import { Toaster } from "@acme/ui/toast"

import "@/app/globals.css"

import { env } from "@/env"

export const metadata: Metadata = {
   metadataBase: new URL(
      env.VERCEL_ENV === "production"
         ? "https://turbo.t3.gg"
         : "http://localhost:3000"
   ),
   title: "Create T3 Turbo",
   description: "Simple monorepo with shared backend for web & mobile apps",
   openGraph: {
      title: "Create T3 Turbo",
      description: "Simple monorepo with shared backend for web & mobile apps",
      url: "https://create-t3-turbo.vercel.app",
      siteName: "Create T3 Turbo",
   },
   twitter: {
      card: "summary_large_image",
      site: "@jullerino",
      creator: "@jullerino",
   },
}

export const viewport: Viewport = {
   themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
   ],
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
