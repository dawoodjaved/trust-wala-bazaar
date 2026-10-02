import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerk = !!(publishableKey && publishableKey !== "pk_test_placeholder");

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
  // Clerk v5: `auth` is a function — call auth().protect(), not auth.protect()
  const { clerkMiddleware, createRouteMatcher } = require("@clerk/nextjs/server") as typeof import("@clerk/nextjs/server");
  const isPublic = createRouteMatcher(publicMatchers);

  return clerkMiddleware(
    (auth, req) => {
      if (!isPublic(req)) {
        const { userId, redirectToSignIn } = auth();
        if (!userId) {
          return redirectToSignIn({ returnBackUrl: req.url });
        }
      }
    },
    {
      signInUrl: "/auth/login",
    },
  );
}

const middlewareImpl = hasClerk ? createClerkAuthMiddleware() : createPassthroughMiddleware();

export default function middleware(request: NextRequest, event: unknown) {
  const { pathname } = request.nextUrl;

  // Next.js API + static uploads handle their own auth / are public assets
  if (pathname.startsWith('/api') || pathname.startsWith('/uploads')) {
    return NextResponse.next();
  }

  return (middlewareImpl as (req: NextRequest, evt: unknown) => unknown)(request, event);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
