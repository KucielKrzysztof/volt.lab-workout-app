/**
 * @fileoverview Server-side data fetching utility for Workouts.
 * Centralizes authentication, data retrieval, and transformation logic
 * specifically for Next.js Server Components.
 * @module features/workouts/api
 */

import { createClient } from "@/core/supabase/server";
import { workoutService } from "@/services/apiWorkouts";
import { mapWorkoutForUI } from "../helpers/workoutHelpers";
import { WorkoutPage } from "@/types/workouts";

/**
 * High-level server utility to fetch a paginated slice of workout history.
 * * @description
 * This function is the cornerstone of the **SSR-to-CSR Hydration Pattern**.
 * By executing in a Server Component, it eliminates "Loading..." states
 * and Cumulative Layout Shift (CLS) on the initial page load.
 * * **Key Responsibilities:**
 * 1. **Identity Guarding**: Validates the Supabase session on the server.
 * 2. **Relational Retrieval**: Invokes the service layer to pull joined workouts/sets.
 * 3. **Data Normalization**: Transforms raw database entities into `WorkoutUI`
 * models before sending them to the client.
 * * **Data Flow Model:**
 * {Server Request} > {Auth Check} > {DB Fetch} > {UI Mapping} > {Hydration Cache}
 * * @param {number} [page=0] - The zero-based page index for pagination.
 * @param {number} [limit=10] - The maximum number of workout records to retrieve per batch.
 * @returns {Promise<WorkoutPage>} A promise resolving to a hydrated `WorkoutPage` object containing mapped items and the global record count.
 * * @example
 * // Usage in app/(dashboard)/workouts/page.tsx
 * const initialData = await getWorkoutsServer(0, 10);
 */
export async function getWorkoutsServer(page = 0, limit = 10): Promise<WorkoutPage> {
	/** * Initialize the Server-side Supabase client.
	 * This client automatically manages session cookies and request headers
	 */
	const supabase = await createClient();

	/** * 1. Authentication Layer:
	 * Validates the JWT from request cookies. If no user is found, the function
	 * fails gracefully to prevent server-side crashes.
	 */
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fallback object to ensure type safety in the UI even if the session is invalid.
	if (!user) return { items: [], totalCount: 0 };

	/** * 2. Data Acquisition Layer:
	 * Delegates the relational query to the workout service.
	 * Includes '{ count: "exact" }' to inform the client of total history depth.
	 */
	const { data, count } = await workoutService.getWorkouts(supabase, user.id, page, limit);

	/** * 3. Transformation & Response Layer:
	 * Maps raw database records into the specific `WorkoutUI` structure.
	 * This reduces the serialization payload size sent to the browser.
	 */
	return {
		items: (data || []).map(mapWorkoutForUI),
		totalCount: count || 0,
	};
}
