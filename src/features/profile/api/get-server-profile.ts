import { cache } from "react";
import { createClient } from "@/core/supabase/server";
import { profileService } from "@/services/apiProfile";

/**
 * High-performance server-side data fetcher for user identity and profile data.
 * * @description
 * This helper centralizes the retrieval of the authenticated user from Supabase Auth
 * and their corresponding public data from the 'profiles' table.
 * * @performance
 * **Request Memoization**: Wrapped in React's `cache` function. If this is called multiple times
 * within the same server request cycle (e.g., in a Layout and a Page), only **one** database
 * round-trip is performed.
 * * @returns {Promise<{ user: User | null, profile: UserProfile | null }>}
 * An object containing the Supabase Auth user and their extended profile data.
 * Returns nulls if the session is invalid or user is not logged in.
 * * @example
 * // Inside a Server Component (page.tsx)
 * const { user, profile } = await getServerProfile();
 */
export const getServerProfile = cache(async () => {
	// Initialize the Supabase client for server-side context (cookies-based)
	const supabase = await createClient();

	// 1. IDENTITY FETCH: Retrieve the user from the current session
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// If no session exists, abort early to prevent unnecessary DB queries
	if (!user) {
		return { user: null, profile: null };
	}

	// 2. DATA HYDRATION: Fetch extended profile metadata from public.profiles
	try {
		const profile = await profileService.getProfile(supabase, user.id);
		return { user, profile };
	} catch (error) {
		/**
		 * Resilience: If the profile fetch fails, we still return the Auth user.
		 * This prevents the entire page from crashing if only the profile data is missing.
		 */
		console.error("Error fetching server profile:", error);
		return { user, profile: null };
	}
});
