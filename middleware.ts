import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only use Clerk middleware if Clerk is configured
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerk = publishableKey && publishableKey !== "pk_test_placeholder";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/search",
  "/products",
  "/categories",
  "/auth",
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  // If Clerk is not configured, allow all routes (for development)
  if (!hasClerk) {
    return NextResponse.next();
  }

  // Dynamic import only if Clerk is configured
  try {
    const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");
    
    const isPublic = createRouteMatcher([
      "/",
      "/search",
      "/products/(.*)",
      "/categories/(.*)",
      "/auth/(.*)",
    ]);

    return clerkMiddleware(async (auth, req) => {
      if (!isPublic(req)) {
        await auth.protect();
      }
    })(request);
  } catch (error) {
    // If Clerk fails, allow the request
    console.warn("Clerk middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
