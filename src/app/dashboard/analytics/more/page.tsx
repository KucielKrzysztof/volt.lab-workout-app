import { AnalyticsMoreClientView } from "@/features/analytics/components/more/AnalyticsMoreClientView";
import { getServerProfile } from "@/features/profile/api/get-server-profile";
import { redirect } from "next/navigation";

/**
 * Analytics and Progress Page.
 * Visualizes training data, muscle group distribution, and volume trends.
 */
export default async function AnalyticsPage() {
	const { user, profile } = await getServerProfile();

	// Guard: Ensure user is not null for TS.
	if (!user) {
		redirect("/auth/login");
	}
	if (!profile) {
		redirect("/auth/login");
	}

	return <AnalyticsMoreClientView userId={user.id} />;
}
