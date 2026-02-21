"use client";

import { useProfile } from "../_hooks/use-profile";
import { AvatarUpload } from "./AvatarUpload";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/ErrorState";
import { RecordsSection } from "@/features/analytics/components/sections/RecordsSection";

interface ProfileClientViewProps {
	/** The unique UUID of the user from the Auth session. */
	userId: string;
	/** * Initial profile data fetched on the server to prevent layout shifts
	 * and provide instant content visibility.
	 */
	initialProfile: any;
}

/**
 * Main Client-Side Orchestrator for the User Profile section.
 * * @description
 * This component acts as the primary container for user identity and achievements.
 * It manages the transition from server-rendered data to a reactive client-side state,
 * ensuring that any updates (like a new PR or changed avatar) are reflected instantly.
 * * @features
 * - **Hybrid Hydration**: Uses server-side data for the first paint and switches to TanStack Query for live updates.
 * - **Error Handling**: Gracefully catches and displays issues with profile retrieval.
 * - **Identity Management**: Wraps the Avatar upload and Name display logic.
 * - **Achievement Tracking**: Integrates the shared RecordsSection to visualize personal bests.
 * * @param {ProfileClientViewProps} props - Component properties.
 */
export const ProfileClientView = ({ userId, initialProfile }: ProfileClientViewProps) => {
	/** * Initialize the profile hook with initial server data.
	 * This ensures the UI is populated immediately while the client fetches the freshest data in the background.
	 */
	const { profile, isError } = useProfile(userId, initialProfile);

	// Error boundary to prevent the app from breaking if a specific profile fails to load
	if (isError) {
		return <ErrorState title="Profile Loading Error" onRetry={() => window.location.reload()} />;
	}

	return (
		<div className="grid gap-8 animate-in fade-in duration-500">
			{/* IDENTITY CARD
                Displays the user's visual identity and display name in a high-contrast layout.
            */}
			<Card className="p-6 bg-secondary/5 border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl">
				<AvatarUpload userId={userId} />

				<div className="text-center md:text-left space-y-1">
					<h2 className="text-3xl font-black uppercase italic tracking-tighter">{profile?.display_name || "Anonymous Athlete"}</h2>
					<p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">Active Registry Member</p>
				</div>
			</Card>

			{/* PERSONAL RECORDS SECTION
                Reuses the specialized RecordsSection from the Analytics feature to maintain UI consistency.
                Hardcoded to current year 2026 for the PR overview.
            */}
			<RecordsSection records={profile?.personal_records || []} year={2026} showTitle={true} />
		</div>
	);
};
