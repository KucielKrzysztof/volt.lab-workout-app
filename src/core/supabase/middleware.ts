import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Creates a Supabase client specifically for Next.js Middleware.
 * Its primary responsibility is to refresh the user's session token
 * and pass the updated cookies back to the browser via the response.
 * @param request - The incoming Next.js request object.
 */

export const createClient = (request: NextRequest) => {
	// Create an unmodified response
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				// Update request cookies for the current execution
				cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
				// Create a new response to set the updated cookies in the browser
				response = NextResponse.next({
					request,
				});
				cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
			},
		},
	});

	return { supabase, response };
};
