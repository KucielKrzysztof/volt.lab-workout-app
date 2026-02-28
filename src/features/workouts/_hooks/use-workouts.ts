/**
 * @fileoverview Data orchestration hook for workout history management.
 * Leverages TanStack Query v5 to provide a high-performance, cached,
 * and hydrated data stream for workout history views.
 * @module features/workouts/hooks
 */

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { workoutService } from "@/services/apiWorkouts";
import { mapWorkoutForUI } from "../helpers/workoutHelpers";
import { WorkoutUI } from "@/types/workouts";

/**
 * Custom hook to manage, cache, and synchronize the user's workout history state.
 * * @description
 * This hook is the primary consumer of the `workoutService`. It implements the
 * **SSR-to-CSR Hydration Pattern**, allowing the application to transition
 * seamlessly from server-rendered HTML to a fully interactive client-side
 * state without redundant network requests.
 * * **Key Operational Logic:**
 * 1. **Cache Seeding**: Utilizes `initialData` (pre-fetched on the server) to
 * populate the TanStack Query cache immediately upon mount.
 * 2. **Data Transformation**: Automatically invokes `mapWorkoutForUI` during the
 * fetch cycle, ensuring the component receives optimized, localized, and
 * deduplicated models.
 * 3. **Smart Revalidation**: Marked as fresh for 5 minutes ($300,000$ ms) to
 * balance data accuracy with database performance.
 * * @param {string} userId - The unique UUID of the user, used as a primary cache key dependency.
 * @param {WorkoutUI[]} [initialData] - Optional pre-fetched UI-ready data from a Server Component.
 * * @returns {UseQueryResult<WorkoutUI[]>} A query object containing the history array,
 * loading states, and post-hydration status.
 * * @example
 * // Usage in a Client Component (CSR Orchestrator)
 * const { data: workouts, isLoading } = useWorkouts(user.id, initialWorkouts);
 */
export const useWorkouts = (userId: string, initialData?: WorkoutUI[]) => {
	const supabase = createClient();

	return useQuery({
		/** * Deterministic Query Key:
		 * Scoped to the 'workouts' namespace and the specific 'userId'.
		 * Ensures that history is never leaked between different user sessions.
		 */
		queryKey: ["workouts", userId],

		/**
		 * Fetches and transforms raw database records into UI-ready objects.
		 * Mapping occurs inside the queryFn so the cache stores the final WorkoutUI format.
		 * * @throws {PostgRESTError} If the database query fails.
		 */
		queryFn: async () => {
			const { data, error } = await workoutService.getWorkouts(supabase, userId);
			if (error) throw error;

			/** * Transformation Cycle:
			 * We map the data inside the `queryFn` so that the cache stores the final
			 * `WorkoutUI` format rather than raw database entities.
			 */
			return (data || []).map(mapWorkoutForUI);
		},

		/**
		 * Hydration Logic:
		 * This seeds the React Query cache with server-side data, preventing
		 * "loading spinners" and layout shifts on initial page load.
		 */
		initialData,
		// Data fresh for 5 mins
		staleTime: 1000 * 60 * 5,
	});
};
