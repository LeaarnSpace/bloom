import { NextResponse, type NextRequest } from "next/server";

// Before launch, public pages other than the coming-soon page send visitors home.
export function proxy(request: NextRequest) {
  if (process.env.SITE_MODE === "full") return NextResponse.next();
  return NextResponse.redirect(new URL("/", request.url), 307);
}

export const config = {
  matcher: ["/listings/:path*", "/providers/:path*"],
};
