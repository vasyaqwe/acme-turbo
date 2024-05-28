import { LoginForm } from "../_components/login"

export default function Page() {
   return (
      <div className="isolate grid min-h-[85vh] place-items-center">
         <div className="absolute z-[-1] min-h-[85vh] w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
         <LoginForm />
      </div>
   )
}
