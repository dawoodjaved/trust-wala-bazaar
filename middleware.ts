import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { shouldEnableClerk } from "@/lib/clerk-config";

const hasClerk = shouldEnableClerk();

const publicMatchers = [
  "/",
  "/home",
  "/search(.*)",
  "/products(.*)",
  "/categories(.*)",
  "/shops(.*)",
  "/auth(.*)",
];

function createPassthroughMiddleware() {
  return function middleware() {
    return NextResponse.next();
  };
}

function createClerkAuthMiddleware() {
  // Clerk v6: auth() is async — await auth() inside clerkMiddleware
  const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server") as typeof import("@clerk/nextjs/server");
  const isPublic = createRouteMatcher(publicMatchers);

  return clerkMiddleware(
    async (auth, req) => {
      if (!isPublic(req)) {
        const { userId, redirectToSignIn } = await auth();
        if (!userId) {
          return redirectToSignIn({ returnBackUrl: req.url });
        }
      }
    },
    {
      signInUrl: "/auth/login",
      signUpUrl: "/auth/signup",
    },
  );
}

const middlewareImpl = hasClerk ? createClerkAuthMiddleware() : createPassthroughMiddleware();

export default function middleware(request: NextRequest, event: unknown) {
  const { pathname } = request.nextUrl;

  // Landing + API + uploads: skip Clerk middleware (keeps first paint fast)
  if (
    pathname === "/" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads")
  ) {
    return NextResponse.next();
  }

  return (middlewareImpl as (req: NextRequest, evt: unknown) => unknown)(request, event);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
