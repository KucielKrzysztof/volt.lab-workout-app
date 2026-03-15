/**
 * @fileoverview Supabase Administrative Client Factory.
 * Provides a privileged client instance for server-side operations that require RLS bypass.
 * @module core/supabase/admin
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Instantiates a Supabase client with administrative privileges.
 * * @description
 * This factory function utilizes the `SUPABASE_SERVICE_ROLE_KEY` to bypass
 * Row Level Security (RLS) policies. It is intended for sensitive backend
 * operations such as account decommissioning or global data management.
 * * @security
 * - **Server-Only**: This client must ONLY be instantiated in Server Actions or API Routes.
 * - **Environment**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is defined in `.env.local`
 * WITHOUT the `NEXT_PUBLIC_` prefix to prevent browser-side exposure.
 * * @throws {Error} Throws if the `SUPABASE_SERVICE_ROLE_KEY` is missing from the environment.
 * @returns {Promise<SupabaseClient>} A privileged Supabase client instance configured for server execution.
 */
export const createAdminClient = async () => {
	// Environment variables are retrieved from the Node.js process at runtime.
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

	if (!supabaseServiceKey) {
		throw new Error("Critical Security Error: Missing SUPABASE_SERVICE_ROLE_KEY. " + "Verify your server-side environment variables.");
	}

	return createClient(supabaseUrl, supabaseServiceKey, {
		auth: {
			autoRefreshToken: false, // Disabled for non-browser environments
			persistSession: false, // Prevents storage polling in server-side execution
		},
	});
};
