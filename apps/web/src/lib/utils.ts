export function formatDate(
   date: Date | string | number,
   options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
   }
) {
   return new Intl.DateTimeFormat("en-US", {
      ...options,
   }).format(new Date(date))
}

export function formatCurrency(
   price: number | string,
   options: Intl.NumberFormatOptions = {}
) {
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: options.currency ?? "USD",
      notation: options.notation ?? "compact",
      ...options,
   }).format(Number(price))
}

export const delay = async <T>(promise: Promise<T>, ms: number) => {
   const delay = new Promise((resolve) => setTimeout(resolve, ms))
   try {
      const [result] = await Promise.all([promise, delay])
      return result
   } catch (error) {
      await delay // Wait for the delay even if the promise fails
      throw error
   }
}

export const action = <T, R>(
   apiMethod: (input: T) => Promise<R>,
   more?: (result: R) => void
) => {
   return async (input: T) => {
      const result = await apiMethod(input)
      more?.(result)
   }
}
