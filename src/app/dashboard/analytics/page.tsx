import AnalyticsClientView from "@/features/analytics/components/AnalyticsClientView";
import { getServerProfile } from "@/features/profile/api/get-server-profile";

/**
 * Analytics and Progress Page.
 * Visualizes training data, muscle group distribution, and volume trends.
 */
export default async function AnalyticsPage() {
	const { user, profile } = await getServerProfile();

	return <AnalyticsClientView userId={user?.id} initialProfile={profile} />;
}
