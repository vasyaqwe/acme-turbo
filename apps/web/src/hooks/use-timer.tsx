import { useEffect, useState } from "react"

export function useTimer() {
   const [timer, setTimer] = useState(0)

   useEffect(() => {
      if (timer === 0) return

      const interval = setInterval(() => {
         setTimer((prev) => prev - 1)
      }, 1000)

      return () => {
         clearInterval(interval)
      }
   }, [timer])

   const startTimer = (time: number) => {
      setTimer(time)
   }
   const endTimer = () => {
      setTimer(0)
   }

   return { timeLeft: timer, startTimer, endTimer }
}
