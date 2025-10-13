import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const isStaticAsset = path.startsWith("/_next") || path === "/favicon.ico";
  if (isStaticAsset) return NextResponse.next();

  const jwtToken = (await cookies()).get("token")?.value;
  const jwtPayload = await decrypt(jwtToken);

  if (!isPublicRoute && !jwtPayload?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && jwtPayload?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  const requestHeaders = new Headers(req.headers);
  if (jwtPayload && typeof jwtPayload.userId === "string") {
    requestHeaders.set("x-user-id", jwtPayload.userId);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)).*)",
  ],
};
