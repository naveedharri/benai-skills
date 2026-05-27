import { NextRequest, NextResponse } from "next/server";

// Basic auth. Set BASIC_AUTH_USER + BASIC_AUTH_PASS in env to enable.
// If either is unset, auth is disabled (useful for local dev).
export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;
  if (!user || !pass) return NextResponse.next();

  const header = req.headers.get("authorization") || "";
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  if (header === expected) return NextResponse.next();

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="{{ORG_NAME}} Dashboard"' },
  });
}

export const config = {
  // Cover everything except Next internals and favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
