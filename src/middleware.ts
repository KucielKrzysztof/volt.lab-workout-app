import { type NextRequest } from "next/server";
import { createClient } from "./core/supabase/middleware";

/**
 * Next.js Middleware.
 * * * Responsibilities:
 * 1. Session Refreshing: It intercepts requests to update the Supabase
 * Auth session via cookies before the page or route handler is reached.
 * 2. Performance: Filters out static assets (images, CSS, etc.) using the matcher
 * to avoid unnecessary server-side logic on non-page requests.
 * * @param request - The incoming Next.js request.
 * @returns A response with updated session cookies.
 */

export async function middleware(request: NextRequest) {
	// This call initializes the specialized middleware client
	// which handles the cookie-swap logic behind the scenes.
	return await createClient(request);
}

/**
 * Middleware Configuration.
 * * The matcher uses a regex to define which paths the middleware should run on.
 * * It explicitly excludes:
 * - _next/static & _next/image (Next.js internals)
 * - favicon.ico (system icon)
 * - Common image formats (svg, png, jpg, etc.)
 */
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
