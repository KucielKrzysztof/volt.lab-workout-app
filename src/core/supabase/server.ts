import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Creates a Supabase client for use in Server Components, Actions, and Route Handlers.
 * It uses 'next/headers' to access and manage cookies on the server side.
 * This is the client used by 'getExercisesServer' for SSR.
 */

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient(supabaseUrl!, supabaseKey!, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					// Attempt to set cookies if called from a Server Action or Route Handler
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
				} catch {
					// This catch block is expected when called from a Server Component,
					// as SCs cannot modify cookies. Middleware handles refresh in this case.
				}
			},
		},
	});
}
