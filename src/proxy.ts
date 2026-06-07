import { NextResponse, type NextRequest } from "next/server";

const TRACK_HOSTS = new Set([
  "track.arcontruction.ca",
  "track.arconstruction.ca",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (!host || !TRACK_HOSTS.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (!url.pathname.startsWith("/track")) {
    url.pathname = `/track${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
