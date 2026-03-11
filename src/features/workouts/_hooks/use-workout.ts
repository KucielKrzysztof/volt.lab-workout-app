/**
 * @fileoverview Data fetching hook for individual workout session details.
 * Utilizes TanStack Query v5 to manage the state, caching, and hydration
 * of a specific training session's relational data.
 * @module features/workouts/hooks
 */

import { useQuery } from "@tanstack/react-query";
import { workoutService } from "@/services/apiWorkouts";
import { createClient } from "@/core/supabase/client";
import { Workout } from "@/types/workouts";

/**
 * Custom hook to retrieve and cache the full details of a specific workout session.
 * * @description
 * This hook is the primary data source for the `WorkoutDetailView`. It implements the
 * **SSR-to-CSR Hydration Pattern**, allowing a single session's data (including
 * all nested sets and exercises) to be pre-rendered on the server and instantly
 * hydrated on the client.
 * * **Operational Behavior:**
 * 1. **Data Consistency**: Ensures that if a workout is not found in the database,
 * an explicit Error is thrown to be caught by the nearest Error Boundary.
 * 2. **Immutability Strategy**: Since completed workouts are historical records,
 * the `staleTime` is set to 1 hour to eliminate redundant background refetches.
 * 3. **Relational Casting**: Maps the raw PostgREST response to the `Workout`
 * type, providing full IntelliSense for nested `workout_sets`.
 * 4. **Offline Resilience**: Implements `networkMode: 'offlineFirst'` to ensure
 * that the detail view remains stable during signal drops in gym environments.
 * 5. **Extended Persistence**: Retains historical data in the cache for 24 hours
 * (`gcTime`) to support offline analysis and review
 * * @param {string} id - The unique UUID of the workout session to fetch.
 * @param {Workout} [initialData] - Optional pre-fetched data from `getWorkoutServer`
 * to seed the cache and enable instant rendering.
 * * @returns {UseQueryResult<Workout>} A query object containing the detailed session data,
 * loading/error states, and hydration metadata.
 * * @example
 * // Implementation in a Workout Detail Page
 * const { data: workout, isLoading, error } = useWorkout(params.id, initialData);
 * * if (workout) {
 * console.log(`Workout: ${workout.name}, Volume: ${workout.total_volume}kg`);
 * }
 */
export const useWorkout = (id: string, initialData?: Workout) => {
	const supabase = createClient();

	return useQuery({
		/** * Deterministic Cache Key:
		 * Uniquely identifies this specific session within the 'workout' namespace.
		 */
		queryKey: ["workout", id],

		/**
		 * Data Acquisition Logic:
		 * Performs a deep relational fetch via the workout service.
		 * @throws {Error} If the database query fails or if no record matches the ID.
		 */
		queryFn: async () => {
			const { data, error } = await workoutService.getWorkoutById(supabase, id);

			if (error) throw error;

			// Explicit check for non-existent records to prevent undefined UI states.
			if (!data) throw new Error("Workout not found");

			/** * Type-Safe Projection:
			 * We cast the response to 'Workout' to satisfy the interface requirements
			 * of the detail view components.
			 */
			return data as unknown as Workout;
		},

		/**
		 * Hydration Seed:
		 * Injects server-fetched data into the client cache to eliminate loading
		 * states for the end user.
		 */
		initialData,

		/** * Global Connectivity Protocol:
		 * Freshness set to 1 hour; GC retains data for 24 hours for offline availability.
		 */
		staleTime: 1000 * 60 * 60,
		gcTime: 1000 * 60 * 60 * 24,
		networkMode: "offlineFirst",
	});
};
