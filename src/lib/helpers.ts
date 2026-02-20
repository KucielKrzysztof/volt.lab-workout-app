import { User } from "@supabase/supabase-js";

/**
 * Extracts initials from the user session for Avatar placeholders.
 * * Logic flow:
 * 1. Checks for loading state or missing session.
 * 2. Prioritizes 'full_name' from metadata, then the user's email.
 * 3. Trims and formats to a 2-character uppercase string to match the app's bold aesthetic.
 * * @param isLoading - Current authentication loading status.
 * @param user - The Supabase user object or null.
 * @returns A 2-character string (e.g., "DZ"), "--" during load, or "??" if data is corrupt.
 */
export const getInitials = (isLoading: boolean, user: User | null | undefined) => {
	// 1. Handle loading or missing user session
	if (isLoading || !user) return "--";

	// 2. Extract potential name sources
	const name = user.user_metadata?.full_name || user.email || "";

	// 3. Clean up and format
	const cleanName = name.trim();

	if (!cleanName) return "??";

	return cleanName.substring(0, 2).toUpperCase();
};

/**
 * Derives a display name from the user's email prefix.
 * * Logic flow:
 * 1. Returns a loading indicator if auth is pending.
 * 2. Splits the email at the '@' symbol and grabs the first part.
 * 3. Transforms the result to uppercase to maintain UI consistency.
 * * @param isLoading - Current authentication loading status.
 * @param user - The Supabase user object or null.
 * @returns The email prefix (e.g., "DZIKU99"), "LOADING...", or "--" if unauthorized.
 */
export const getDisplayName = (isLoading: boolean, user: User | null | undefined) => {
	if (isLoading) return "LOADING...";
	if (!user || !user.email) return "--";

	return user.email.split("@")[0].toUpperCase() || "";
};
