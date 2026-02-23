import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { workoutService } from "@/services/apiWorkouts";
import { mapWorkoutForUI } from "../helpers/workoutHelpers";
import { WorkoutUI } from "@/types/workouts";

/**
 * Custom hook to manage and cache the workout history state.
 * Implements a "Hydration" pattern by accepting initial data from Server Components
 * to ensure zero-flicker transitions between SSR and CSR.
 * * @param userId - The unique identifier used as a cache key dependency.
 * @param initialData - Optional pre-fetched data from the server to seed the cache.
 * @returns An object containing the cached workouts, loading state, and error status.
 */
export const useWorkouts = (userId: string, initialData?: WorkoutUI[]) => {
	const supabase = createClient();

	return useQuery({
		queryKey: ["workouts", userId],
		/**
		 * Fetches and transforms raw database records into UI-ready objects.
		 * Mapping occurs inside the queryFn so the cache stores the final WorkoutUI format.
		 */
		queryFn: async () => {
			const { data, error } = await workoutService.getWorkouts(supabase, userId);
			if (error) throw error;

			return (data || []).map(mapWorkoutForUI);
		},
		/**
		 * Hydration: This property allows the hook to return the server-provided data
		 * immediately on the first render, preventing a "loading spinner" experience.
		 */
		initialData,
		// Data fresh for 5 mins
		staleTime: 1000 * 60 * 5,
	});
};
