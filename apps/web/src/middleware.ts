import { verifyRequestOrigin } from "lucia"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest): Promise<NextResponse> {
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
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * Feel free to modify this pattern to include more paths.
       */
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
