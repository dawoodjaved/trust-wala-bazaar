import { createClerkClient, verifyToken } from "@clerk/backend";
import { prisma } from "@/lib/server/prisma";
import { signAccessToken } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { hasClerkConfigured, isEmailAuthAllowed } from "@/lib/server/env";

type UpsertInput = {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

async function upsertAndToken(input: UpsertInput) {
  const user = await prisma.user.upsert({
    where: { clerkId: input.clerkId },
    create: {
      clerkId: input.clerkId,
      email: input.email,
      firstName: input.firstName || input.email.split("@")[0],
      lastName: input.lastName || "",
    },
    update: {
      email: input.email,
      ...(input.firstName ? { firstName: input.firstName } : {}),
      ...(input.lastName ? { lastName: input.lastName } : {}),
    },
    select: {
      id: true,
      clerkId: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      cnicVerified: true,
      videoVerified: true,
      role: true,
    },
  });

  return {
    access_token: signAccessToken(user),
    user,
  };
}

async function verifyClerkBearer(request: Request): Promise<UpsertInput | null> {
  if (!hasClerkConfigured()) return null;

  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  const sessionToken = header.slice(7).trim();
  if (!sessionToken) return null;

  try {
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    const clerkUserId = payload.sub;
    if (!clerkUserId) return null;

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const clerkUser = await clerk.users.getUser(clerkUserId);
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    return {
      clerkId: clerkUserId,
      email,
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // Login / token minting abuse
  const limited = enforceRateLimit(request, "auth-verify", 20, 60);
  if (limited) return limited;

  try {
    // Preferred: verified Clerk session — never trust client-supplied clerkId
    const fromClerk = await verifyClerkBearer(request);
    if (fromClerk) {
      return json(await upsertAndToken(fromClerk));
    }

    if (!isEmailAuthAllowed()) {
      return error(
        "Unauthorized. Configure a working Clerk instance (not clerk.*.vercel.app), or set ALLOW_DEMO_AUTH / ALLOW_EMAIL_AUTH.",
        401,
      );
    }

    const body = await request.json().catch(() => ({}));
    const { clerkId, email, firstName, lastName } = body || {};

    if (!clerkId || !email || typeof clerkId !== "string" || typeof email !== "string") {
      return error("clerkId and email are required for email auth", 400);
    }

    if (!clerkId.startsWith("demo_") && !clerkId.startsWith("email_")) {
      return error("Email auth only accepts demo_ or email_ clerkId values", 400);
    }

    return json(
      await upsertAndToken({
        clerkId,
        email,
        firstName: typeof firstName === "string" ? firstName : undefined,
        lastName: typeof lastName === "string" ? lastName : undefined,
      }),
    );
  } catch (e) {
    console.error("auth/verify error:", e);
    return error("Failed to verify user", 500);
  }
}
