import Link from "next/link"

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <>
         <header className=" flex justify-between p-5 ">
            <Link
               href={"/"}
               className="text-2xl font-semibold leading-none"
            >
               acme
            </Link>
         </header>
         <main>{children}</main>
      </>
   )
}
