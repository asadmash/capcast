import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { slidingWindow, validateEmail } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";

export const {GET, POST} = toNextJsHandler(auth.handler)

// Email Validation
const emailValidation = aj.withRule(
    validateEmail({mode: 'LIVE', block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS']})
)
