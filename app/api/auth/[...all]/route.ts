// Import necessary Arcjet and authentication libraries
import aj from "@/lib/arcjet"; // Import Arcjet client
import { auth } from "@/lib/auth"; // Import authentication handler
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next"; // Import Arcjet types and rules
import { toNextJsHandler } from "better-auth/next-js"; // Import Next.js handler for authentication
import { NextRequest } from "next/server"; // Import Next.js request type
import ip from "@arcjet/ip"; // Import IP retrieval utility

// This line is commented out, but it would export the GET and POST handlers directly
// export const { GET, POST } = toNextJsHandler(auth.handler);

// Configure email validation rule using Arcjet
const emailValidation = aj.withRule(
  validateEmail({
    mode: "LIVE", // Enforce the rule in LIVE mode
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"], // Block emails that are disposable, invalid, or have no MX records
  })
);

// Configure rate limiting rule using Arcjet
const rateLimit = aj.withRule(
  slidingWindow({
    mode: "LIVE", // Enforce the rule in LIVE mode
    interval: "2m", // Set a 2-minute sliding window
    max: 2, // Allow a maximum of 2 requests per interval
    characteristics: ["fingerprint"], // Uniquely identify clients by their fingerprint
  })
);

// Middleware to protect authentication routes
const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  // Retrieve the current session from the request headers
  const session = await auth.api.getSession({ headers: req.headers });

  let userId = "string"; // Initialize userId with a default string
  // If a user is logged in, use their ID as the identifier
  if (session?.user?.id) {
    userId = session.user.id;
  } else {
    // Otherwise, use the client's IP address as the identifier
    userId = ip(req) || "127.0.0.1";
  }

  // If the request is for the sign-in route, apply email validation
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    const body = await req.clone().json(); // Clone and parse the request body

    // If the email is a string, validate it with Arcjet
    if (typeof body.email === "string") {
      return emailValidation.protect(req, { email: body.email });
    }
  }

  // For all other authentication requests, apply rate limiting
  return rateLimit.protect(req, { fingerprint: userId });
};

// Create authentication handlers using the configured auth object
const authHandlers = toNextJsHandler(auth.handler);

// Export the GET handler
export const { GET } = authHandlers;

// Export the POST handler with Arcjet protection
export const POST = async (req: NextRequest) => {
  // First, run the request through the Arcjet protection middleware
  const decision = await protectedAuth(req);

  // If Arcjet denies the request, handle the decision
  if (decision.isDenied()) {
    // If the denial is due to email validation, throw an error
    if (decision.reason.isEmail()) {
      throw new Error("Email Validation Failed");
    }

    // If the denial is due to rate limiting, throw an error
    if (decision.reason.isRateLimit()) {
      throw new Error("Rate Limit Exceeded");
    }
    // If the denial is due to the Arcjet Shield, throw an error
    if (decision.reason.isShield()) {
      throw new Error("Shield turned on, protected against malicious actions.");
    }
  }
  // If the request is allowed, proceed with the original POST handler
  return authHandlers.POST(req);
};
