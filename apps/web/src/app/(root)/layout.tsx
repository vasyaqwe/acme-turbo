import { Sidebar } from "@/app/(root)/_components/sidebar"
import { ModalProvider } from "@/components/modals"
import { HydrateClient, api } from "@/trpc/server"

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   void api.user.me()

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
