import { LoginForm } from "../_components/login"
import { DottedBg } from "@acme/ui/dotted-bg"

export default function Page() {
   return (
      <div className="isolate grid min-h-[85vh] place-items-center">
         <DottedBg />
         <LoginForm />
      </div>
   )
}
