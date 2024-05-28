import { Expenses } from "@/app/(root)/_components/expenses"
import { Intro } from "@/app/(root)/_components/intro"

export default function Page() {
   return (
      <div className="w-full py-6">
         <Intro />
         <Expenses />
      </div>
   )
}
