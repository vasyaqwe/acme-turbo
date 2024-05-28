"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "."

const InputOTP = React.forwardRef<
   React.ElementRef<typeof OTPInput>,
   React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
   <OTPInput
      ref={ref}
      containerClassName={cn(
         "flex items-center gap-2 has-[:disabled]:opacity-85",
         containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
   />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
   React.ElementRef<"div">,
   React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
   <div
      ref={ref}
      className={cn("flex w-full items-center", className)}
      {...props}
   />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
   React.ElementRef<"div">,
   React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
   const inputOTPContext = React.useContext(OTPInputContext)

   return (
      <div
         ref={ref}
         className={cn(
            `relative flex h-12 flex-[0_0_16.66%] items-center justify-center border-y border-r border-input bg-background text-xl transition-all 
            first:rounded-l-md first:border-l last:rounded-r-md md:h-14 md:text-2xl lg:first:rounded-l-lg lg:last:rounded-r-lg`,
            inputOTPContext.slots[index]?.isActive && "ring ring-border/40",
            className
         )}
         {...props}
      >
         {inputOTPContext.slots[index]?.char}
         {inputOTPContext.slots[index]?.hasFakeCaret && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
               <div className="animate-caret-blink h-6 w-px bg-foreground duration-1000 md:h-8" />
            </div>
         )}
      </div>
   )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
   React.ElementRef<"div">,
   React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
   <div
      ref={ref}
      role="separator"
      {...props}
   >
      •
   </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
