/**
 * @fileoverview Application Proxy & Identity Guard.
 * Acts as the primary orchestrator for the Next.js 16 Request/Response pipeline,
 * handling session integrity, route protection, and SSR theme synchronization.
 * @module core/middleware
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./core/supabase/middleware";

/**
 * Proxy Orchestrator (formerly Middleware).
 * * * Responsibilities:
 * 1. Session Refreshing: It intercepts requests to update the Supabase
 * Auth session and theme via cookies before the page or route handler is reached.
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

	/** * 2.THEME SYNCHRONIZATION:
	 * Reads the 'theme' cookie to ensure the server renders the correct CSS classes.
	 * If missing, it defaults to 'dark' (Midnight) to maintain branded consistency.
	 */
	const theme = request.cookies.get("theme")?.value;

	// if no cookie yet defaults to - dark
	if (!theme) {
		response.cookies.set("theme", "dark", {
			path: "/",
			maxAge: 31536000, // 1 year cookie
			sameSite: "lax",
		});
	}

	/** * 3. IDENTITY RESOLUTION:
	 * Fetches the user data. This is an optimized check using the freshly
	 * refreshed session from step 1.
	 */
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const url = new URL(request.url);

	/** * 4. PROTECTION GUARD (/dashboard/**):
	 * Implements a strict boundary for the private laboratory environment.
	 * Unauthenticated access attempts are redirected to the login flow.
	 * We protect all /dashboard routes EXCEPT for /dashboard/privacy.
	 * This ensures the Privacy Policy & TERMS OF SERVICE is public.
	 */
	const isDashboardRoute = url.pathname.startsWith("/dashboard");
	const isPrivacyException = url.pathname === "/dashboard/privacy";

	if (isDashboardRoute && !isPrivacyException && !user) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	/** * 5. AUTH PAGE REDIRECTS:
	 * Prevents logged-in users from accessing authentication pages (Login/Register/Root),
	 * streamlining the user journey directly to the training feed.
	 */
	const authPaths = ["/auth/login", "/auth/register", "/"];
	if (authPaths.includes(url.pathname) && user) {
		return NextResponse.redirect(new URL("/dashboard/feed", request.url));
	}

	return response;
}

/**
 * Middleware Matcher Configuration.
 * * @description
 * Optimized regex to ensure the proxy logic only runs on relevant routes.
 * It explicitly ignores:
 * 1. Static Assets (_next/static, images, icons)
 * 2. Next.js Internals (_next/image)
 * 3. Common public file extensions.
 */
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
