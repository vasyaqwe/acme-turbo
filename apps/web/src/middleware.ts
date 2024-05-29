import { verifyRequestOrigin } from "lucia"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function middleware(
   request: NextRequest
): Promise<NextResponse> {
   if (request.method === "GET") {
      return NextResponse.next()
   }
   const originHeader = request.headers.get("Origin")
   // NOTE: You may need to use `X-Forwarded-Host` instead
   const hostHeader = request.headers.get("Host")
   if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
   ) {
      return new NextResponse(null, {
         status: 403,
      })
   }
   return NextResponse.next()
}

export const config = {
   matcher: [
      {
         source:
            "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
         missing: [
            { type: "header", key: "next-router-prefetch" },
            { type: "header", key: "purpose", value: "prefetch" },
         ],
      },
   ],
}
