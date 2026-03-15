/**
 * @fileoverview Account Decommissioning Logic.
 * Handles the secure and permanent removal of user accounts and associated
 * relational data within the Supabase ecosystem.
 * @module features/auth/api/deleteUserAccount
 */

"use server";

import { createAdminClient } from "@/core/supabase/admin";
import { createClient } from "@/core/supabase/server"; // Standardowy klient serwerowy
import { cookies } from "next/headers";

/**
 * Permanently deletes a user account and terminates the current session.
 * * @description
 * This function orchestrates a multi-step decommissioning process:
 * 1. **Identity Verification**: Authenticates the requester against the
 * active session to prevent ID spoofing.
 * 2. **Administrative Deletion**: Triggers `auth.admin.deleteUser` via a
 * privileged client, which initiates a PostgreSQL `ON DELETE CASCADE`
 * across all linked relational tables (profiles, workouts, etc.).
 * 3. **Session Purge**: Synchronously wipes authentication cookies to
 * invalidate the local client state.
 * * @security
 * - **Authorization Check**: Ensures `userId` matches the authenticated user's ID.
 * - **Admin Privileges**: Utilizes Service Role permissions to modify the `auth` schema.
 * - **Server-Side Execution**: Protected via the `"use server"` directive to
 * prevent exposure of administrative logic to the client-side bundle.
 * * @param {string} userId - The unique UUID of the user account to be deleted.
 * @throws {Error} Throws an "Unauthorized" error if the session ID does not
 * match the provided userId.
 * @throws {Error} Throws a "Critical" error if the administrative deletion
 * fails at the database level.
 * * @returns {Promise<{ success: boolean }>} An object confirming the successful
 * completion of the deletion protocol.
 */
export async function deleteUserAccount(userId: string) {
	// 1. SECURITY CHECK: Validate requester identity
	const clientSupabase = await createClient();
	const {
		data: { user },
	} = await clientSupabase.auth.getUser();

	if (!user || user.id !== userId) {
		throw new Error("Unauthorized: You can only delete your own account.");
	}

	// 2. INITIALIZE ADMIN: Access privileged administrative API
	const adminSupabase = await createAdminClient();

	// 3. ATOMIC DELETE: Triggers PostgreSQL cascading delete constraints
	const { error } = await adminSupabase.auth.admin.deleteUser(userId);

	if (error) {
		console.error("Auth Admin Error:", error.message);
		throw new Error("Critical: Failed to decommission account.");
	}

	// 4. CLEANUP: Purge local session cookies
	const cookieStore = await cookies();

	/** * Iterative Cookie Removal:
	 * Scans for Supabase-specific auth tokens and deletes them to force
	 * immediate client-side logout.
	 */
	cookieStore.getAll().forEach((cookie) => {
		if (cookie.name.includes("-auth-token") || cookie.name.includes("sb-access-token")) {
			cookieStore.delete(cookie.name);
		}
	});

	return { success: true };
}
