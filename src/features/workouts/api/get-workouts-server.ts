import { createClient } from "@/core/supabase/server";
import { workoutService } from "@/services/apiWorkouts";
import { mapWorkoutForUI } from "../helpers/workoutHelpers";
import { WorkoutUI } from "@/types/workouts";

/**
 * Server-side data fetching utility for Workouts.
 * This function is designed to be used exclusively in Server Components.
 * It centralizes authentication checks, database retrieval, and UI mapping to ensure
 * data consistency across different views (e.g., Feed, History).
 * * @param page - The current page index for pagination.
 * @param limit - The maximum number of workout records to retrieve.
 * @returns A promise resolving to an array of mapped WorkoutUI objects.
 */
export async function getWorkoutsServer(page = 0, limit = 10): Promise<WorkoutUI[]> {
	/** * Initialize the Server-side Supabase client.
	 * This client automatically manages session cookies and request headers [cite: 19-02-2026].
	 */
	const supabase = await createClient();

	/** * 1. Retrieve and validate the current user session.
	 * This ensures the data request is authenticated before hitting the database.
	 */
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Return an empty array if no authenticated session is found to prevent component crashes.
	if (!user) return [];

	/** * 2. Fetch raw workout data from the database service.
	 * Uses nested relational joins to get sets and exercises in a single call.
	 */
	const { data, error } = await workoutService.getWorkouts(supabase, user.id, page, limit);

	if (error) {
		console.error("❌ getWorkoutsServer Error:", error.message);
		return [];
	}

	/** * 3. Transform raw database records into the specific WorkoutUI structure.
	 * This mapping step is performed on the server to reduce client-side processing.
	 */
	return (data || []).map(mapWorkoutForUI);
}
