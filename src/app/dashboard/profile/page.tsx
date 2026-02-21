import { getServerProfile } from "@/features/profile/api/get-server-profile";
import { ProfileClientView } from "@/features/profile/components/ProfileClientView";
import { redirect } from "next/navigation";

/**
 * Server-side Page Component for the User Profile view.
 * * @description
 * This page acts as a high-level orchestrator. It leverages Server-Side Rendering (SSR)
 * to fetch user session and profile data before the page reaches the browser.
 * This ensures "instant-on" performance and eliminates the need for client-side loading spinners.
 * * @process
 * 1. **Data Pre-fetching**: Calls `getServerProfile` (memoized via React cache).
 * 2. **State Injection**: Passes the fetched data as `initialProfile` to the Client View.
 * 3. **Hydration**: The Client View takes over, allowing for real-time updates and interactivity.
 * * @returns {Promise<JSX.Element>} The fully hydrated profile page structure.
 */
export default async function ProfilePage() {
	// Retrieve data on the server to prevent Layout Shift and provide instant content
	const { user, profile } = await getServerProfile();
	// Although the middleware handles this, we add a check here to ensure
	// that 'user' is not null, turning 'user.id' from (string | undefined)
	// into a strict (string).
	if (!user) {
		redirect("/auth/login");
	}

	return (
		<div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10">
			<header>
				<h1 className="text-4xl font-black italic tracking-tighter uppercase">
					User <span className="text-primary">Profile</span>
				</h1>
			</header>

			{/* CLIENT VIEW: Bridges the gap between static server data and dynamic user actions */}
			<ProfileClientView userId={user.id} initialProfile={profile} />
		</div>
	);
}
