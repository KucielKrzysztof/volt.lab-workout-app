/**
 * @fileoverview Server-Side Entry Point for User Identity Management.
 * Orchestrates initial data acquisition and authentication guarding for the Profile feature.
 * @module app/(dashboard)/profile
 */

import { getServerProfile } from "@/features/profile/api/get-server-profile";
import { ProfileClientView } from "@/features/profile/components/ProfileClientView";
import { redirect } from "next/navigation";

/**
 * Server-side Page Component for the User Profile view.
 * * @description
 * This page acts as the **High-Level Orchestrator** for the identity ecosystem.
 * It leverages Server-Side Rendering (SSR) to fetch the user session and
 * profile data before the document
 * reaches the browser.
 * * **Key Architectural Pillars:**
 * 1. **Instant-On Performance**: Eliminates client-side loading spinners by
 * delivering a fully populated HTML shell.
 * 2. **Authentication Guard**: Acts as a secondary security layer, redirecting
 * unauthenticated requests to the login portal.
 * 3. **Zero-CLS Strategy**: By injecting `initialProfile` into the client view,
 * it prevents Cumulative Layout Shift during TanStack Query hydration.
 * 4. **Identity Sync Bridge**: Ensures that the latest metadata (synced via
 * PostgreSQL triggers) is available for the first paint.
 * * @returns {Promise<JSX.Element | void>} The server-rendered profile structure or a redirect.
 */
export default async function ProfilePage() {
	/** * Data Pre-fetching:
	 * Utilizes a memoized fetcher to retrieve both Auth session and public profile.
	 */
	const { user, profile } = await getServerProfile();
	/** * Security Guard:
	 * Strict check to ensure the UUID is present. Although handled by middleware,
	 * this local check provides type-safety for the 'userId' prop.
	 */
	if (!user) {
		redirect("/auth/login");
	}

	/** * Resilience Guard:
	 * If the profile record is missing (e.g., failed trigger during signup),
	 * we prevent rendering of the client view to avoid downstream runtime errors.
	 */
	if (!profile) return null;

	return (
		<div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10">
			<header>
				<h1 className="text-4xl font-black italic tracking-tighter uppercase text-center">
					User <span className="text-primary">Profile</span>
				</h1>
			</header>

			{/* CLIENT ORCHESTRATOR: 
                Bridges the gap between static SSR data and dynamic user mutations.
                Hydrated with 'initialProfile' to ensure immediate reactivity.
            */}
			<ProfileClientView userId={user.id} initialProfile={profile} />
		</div>
	);
}
