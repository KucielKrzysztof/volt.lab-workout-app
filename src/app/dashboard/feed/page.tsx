/**
 * @fileoverview Main Dashboard Feed - Server-side Entry Point.
 * Initiates the hydration bridge for the user's primary feed stream.
 * @module app/dashboard/feed
 */

import { getWorkoutsServer } from "@/features/workouts/api/get-workouts-server";
import { FeedClientView } from "@/features/feed/components/FeedClientView";

/**
 * Feed Page (Main Dashboard).
 * * @description
 * Acts as the primary landing page after successful authentication. This Server
 * Component handles the initial data acquisition to seed the dashboard feed.
 * * **Data Strategy:**
 * Fetches the first page of history (n=10) on the server to ensure LCP
 * optimization and immediate visual feedback.
 * * @returns {Promise<JSX.Element>} The rendered server-side shell for the Feed.
 */
export default async function FeedPage() {
	/** * Initial Hydration Data:
	 * Retrieves the 'WorkoutPage' object (items + totalCount) from the server utility.
	 */
	const initialData = await getWorkoutsServer();

	/**
	 * Client View Orchestration:
	 * Transfers the hydrated state to the FeedClientView.
	 */
	return <FeedClientView initialData={initialData} />;
}
