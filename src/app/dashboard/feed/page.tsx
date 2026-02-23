import { getWorkoutsServer } from "@/features/workouts/api/get-workouts-server";
import { FeedClientView } from "@/features/feed/components/FeedClientView";

/**
 * Feed Page (Main Dashboard).
 * Acts as the primary landing page after successful authentication.
 * * This Server Component handles the initial data hydration for the feed, 
 * fetching the most recent workouts to be displayed immediately upon load.
 * * Features:
 * - Server-side authentication and data retrieval.
 * - Initial hydration for TanStack Query on the client.
 * * @returns {Promise<JSX.Element>} The rendered server-side shell for the Feed.
 */
export default async function FeedPage() {
    /** * Initial Data Fetch:
     * Retrieves authenticated workout data directly on the server. 
     * This prevents layout shift and eliminates initial client-side loading states.
     */
    const initialWorkouts = await getWorkoutsServer();

    /**
     * Client View Orchestration:
     * Passes the server-fetched 'initialWorkouts' to the FeedClientView.
     * This data seeds the client-side cache for seamless interactivity.
     */
    return <FeedClientView initialWorkouts={initialWorkouts} />;
}