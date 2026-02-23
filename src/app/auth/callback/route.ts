import { NextResponse } from "next/server";
import { createClient } from "@/core/supabase/server";

/**
 * Auth Callback Route Handler.
 * This route is responsible for exchanging the temporary auth 'code'
 * for a permanent user session (JWT) stored in cookies.
 * * Flow:
 * 1. User clicks the link in their email.
 * 2. Redirected to /auth/callback?code=...
 * 3. Server exchanges code for session.
 * 4. User is redirected to the dashboard.
 */
export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// The 'next' parameter allows to redirect the user back to a specific page
	const next = searchParams.get("next") ?? "/dashboard/feed";

	if (code) {
		const supabase = await createClient();

		// Exchange the temporary code for a session
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			// Success: Redirect to the intended page
			return NextResponse.redirect(`${origin}${next}`);
		}

		/**
		 * LAZY FIX: Handle the PKCE "Cross-browser" Trap.
		 * If the verifier is missing (flow_not_found), the email is likely
		 * confirmed, but we just can't log them in automatically.
		 */
		const isPkceMismatch = error.code === "flow_not_found" || error.message === "PKCE code verifier not found in storage";

		if (isPkceMismatch) {
			// Instead of auth-error, send them to login
			return NextResponse.redirect(`${origin}/auth/login`);
		}

		// HARD ERROR: For anything else, use the standard error visualization
		return NextResponse.redirect(`${origin}/auth/auth-error?error=${encodeURIComponent(error.message)}`);
	}

	// ERROR: No code provided at all
	return NextResponse.redirect(`${origin}/auth/auth-error?error=No+code+provided`);
}
