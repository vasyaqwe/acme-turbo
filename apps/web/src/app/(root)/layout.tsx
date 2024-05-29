import { Sidebar } from "@/app/(root)/_components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { ModalProvider } from "@/components/modals"
import { HydrateClient, api } from "@/trpc/server"
import { redirect } from "next/navigation"

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   const session = await api.user.me()
   if (!session) redirect("/login")

   return (
      <HydrateClient>
         <ModalProvider />
         <div className="flex">
            <Sidebar />
            <main className="flex-1 px-5 md:px-11">
               <ErrorBoundary>{children}</ErrorBoundary>
            </main>
         </div>
      </HydrateClient>
   )
}
