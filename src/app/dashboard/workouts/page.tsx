import { getWorkoutsServer } from "@/features/workouts/api/get-workouts-server";
import { WorkoutsClientView } from "@/features/workouts/components/WorkoutsClientView";

/**
 * Workouts Page.
 * This page serves as the entry point for viewing workout history and New workout creation. It leverages
 * Next.js Server Components to fetch data on the server, ensuring rapid initial
 * page loads.
 * * Data Flow:
 * 1. Invokes 'getWorkoutsServer' to retrieve authenticated and mapped workout data.
 * 2. Passes the result as 'initialWorkouts' to the client view for hydration.
 * * @returns {Promise<JSX.Element>} The rendered server-side shell for the Workouts view.
 */
export default async function WorkoutsPage() {
	/** * Initial Fetch:
	 * Retrieves the first page of workout history using the server-side utility.
	 * This call includes authentication checks and data mapping.
	 */
	const initialWorkouts = await getWorkoutsServer();

	/** * Client View Rendering:
	 * Transfers the server-fetched data to the client-side orchestrator.
	 * The 'initialWorkouts' prop seeds the TanStack Query cache.
	 */
	return <WorkoutsClientView initialWorkouts={initialWorkouts} />;
}
