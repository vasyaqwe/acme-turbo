"use client"

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
   return <ReactErrorBoundary fallback={<></>}>{children}</ReactErrorBoundary>
}
