import { Sidebar } from "@/app/(root)/_components/sidebar"
import { ModalProvider } from "@/components/modals"
import { HydrateClient, trpc } from "@/trpc/server"

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   void trpc.user.me()

   return (
      <HydrateClient>
         <ModalProvider />
         <div className="flex">
            <Sidebar />
            <main className="flex-1 px-5 md:px-11">{children}</main>
         </div>
      </HydrateClient>
   )
}
