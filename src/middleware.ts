import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isJwtLikeString(token: string | undefined): boolean {
  // Check for valid JWT structure: three parts separated by dots (.)
  const parts = token?.split(".");
  if (!parts || parts?.length !== 3) {
    return false;
  }

  // Doing a loose validation to check if the strings are proper base64 encoded strings
  try {
    if (typeof parts[0] === "string" && typeof parts[1] === "string") {
      atob(parts[0]);
      atob(parts[1]);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }

  // Not a complete validation, but eliminates basic formatting errors
  return true;
}

export function middleware(request: NextRequest) {
  const { protocol, host } = request.nextUrl;
  const cookie = request.cookies.get("nekot-afcsv");

  const isCookieValid = isJwtLikeString(cookie?.value ?? "");

  if (isCookieValid) {
    if (
      request.nextUrl.pathname === `/auth/login` ||
      request.nextUrl.pathname === `/auth/signup` ||
      request.nextUrl.pathname === `/auth/signup/verify`
    ) {
      return NextResponse.redirect(`${protocol}//${host}/dashboard`);
    }
    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname !== `/auth/login` &&
    request.nextUrl.pathname !== `/auth/signup` &&
    request.nextUrl.pathname !== `/auth/signup/verify`
  ) {
    return NextResponse.redirect(`${protocol}//${host}/auth/login`);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)"],
};
