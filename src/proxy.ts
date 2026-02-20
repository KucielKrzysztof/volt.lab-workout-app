import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./core/supabase/middleware";

/**
 * NEXT.JS 16 UPDATE: The 'middleware.ts' convention has been replaced by 'proxy.ts'.
 * * * Responsibilities:
 * 1. Session Refreshing: It intercepts requests to update the Supabase
 * Auth session via cookies before the page or route handler is reached.
 * 2. Performance: Filters out static assets (images, CSS, etc.) using the matcher
 * to avoid unnecessary server-side logic on non-page requests.
 * 3. Protects private routes and redirects if user is not logged in.
 * * @param request - The incoming Next.js request.
 * @returns A response with updated session cookies.
 */

export async function proxy(request: NextRequest) {
	// 1. Refresh the session and get the Supabase user
	// This ensures cookies are updated before we check anything
	const { supabase, response } = await createClient(request);

	// Fetch the current user session
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const url = new URL(request.url);

	// 2. Protect /dashboard/**
	// If a user is NOT logged in and tries to access dashboard, send them to login
	if (url.pathname.startsWith("/dashboard") && !user) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// 3. Redirect logged-in users away from Auth pages
	// If a user IS logged in and tries to access login/register, send them to the feed
	const authPaths = ["/auth/login", "/auth/register", "/"];
	if (authPaths.includes(url.pathname) && user) {
		return NextResponse.redirect(new URL("/dashboard/feed", request.url));
	}

	return response;
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
