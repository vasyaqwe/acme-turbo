import { Intro } from "@/app/(root)/_components/intro"

export default function Page() {
   return (
      <div className="w-full py-6">
         <Intro />
         {/* 
         <Card className="mt-5 p-5 pt-4">
            <h2 className="mb-4 text-xl font-bold">Expenses</h2>
            <ErrorBoundary
               fallback={
                  <div className="py-4 text-red-500">
                     <ExclamationCircleIcon className="mx-auto size-10" />
                     <p className="mt-3 text-center font-medium">
                        There was an error loading expenses.
                     </p>
                  </div>
               }
            >
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[100px] text-left">
                           Name
                        </TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     <Suspense
                        fallback={
                           <>
                              {Array(10)
                                 .fill(0)
                                 .map((_, i) => (
                                    <TableRow key={i}>
                                       <TableCell className="w-[100px] text-center">
                                          <Skeleton className="h-[26px] w-full rounded-full" />
                                       </TableCell>
                                       <TableCell className="text-center">
                                          <Skeleton className="h-[26px] w-full" />
                                       </TableCell>
                                    </TableRow>
                                 ))}
                           </>
                        }
                     >
                        <Expenses />
                     </Suspense>
                  </TableBody>
               </Table>
            </ErrorBoundary>
         </Card> */}
      </div>
   )
}
