import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service for managing the lifecycle of workout sessions and their associated sets.
 * This service handles high-performance data retrieval through nested relational joins
 * and optimized bulk persistence strategies.
 */
export const workoutService = {
	/**
	 * Fetches a paginated list of workout sessions for a specific user.
	 * Uses a deep relational join to retrieve all associated sets and exercise data
	 * (names and muscle groups) in a single database call.
	 * * @param supabase - The authenticated Supabase client instance.
	 * @param userId - The unique identifier of the user whose history is being retrieved.
	 * @param page - The current page index for pagination (starts at 0).
	 * @param limit - The number of records to retrieve per request (default: 10).
	 * @returns A promise resolving to a PostgREST response containing raw Workout data.
	 */
	getWorkouts: async (supabase: SupabaseClient, userId: string, page = 0, limit = 10) => {
		// PostgREST uses 0-based inclusive range indexing (e.g., 0-9 for the first 10 items).
		const from = page * limit;
		const to = from + limit - 1;

		return supabase
			.from("workouts")
			.select(
				`
        *,
        workout_sets (
          *, 
          exercises (
            name,
            muscle_group
          )
        )
      `,
			)
			.eq("user_id", userId)
			.order("started_at", { ascending: false })
			.range(from, to); // Applies server-side pagination to limit payload size.
	},

	/**
	 * Initializes a new workout session in the database.
	 * Sets the initial status to 'in_progress' to represent an active training session.
	 * * @param supabase - The authenticated Supabase client instance.
	 * @param userId - The ID of the user starting the workout.
	 * @param name - The name/title of the workout session (e.g., "Leg Day").
	 * @returns A promise resolving to the newly created workout record.
	 */
	startWorkout: async (supabase: SupabaseClient, userId: string, name: string) => {
		return supabase
			.from("workouts")
			.insert([{ user_id: userId, name, status: "in_progress" }])
			.select()
			.single(); // Returns the created object directly instead of an array.
	},

	/**
	 * Finalizes an active workout session and persists all recorded sets.
	 * Employs a "Bulk Insert" strategy for the workout sets to minimize network latency
	 * and ensure atomic data consistency across the session.
	 * * @param supabase - The authenticated Supabase client instance.
	 * @param workoutId - The ID of the workout session being finalized.
	 * @param finalData - Metadata for the completed session, including duration and total volume.
	 * @param sets - An array of exercise sets collected locally during the active session.
	 * @throws Will throw an error if either the workout update or the sets insertion fails.
	 * @returns A promise resolving to a success indicator object.
	 */
	finishWorkout: async (
		supabase: SupabaseClient,
		workoutId: string,
		finalData: {
			duration_seconds: number;
			total_volume: number;
			completed_at: string;
		},
		sets: Array<{
			exercise_id: string;
			weight: number;
			reps: number;
			set_order: number;
		}>,
	) => {
		// 1. Update the workout header to mark it as completed and store summary stats
		const { error: workoutError } = await supabase
			.from("workouts")
			.update({
				...finalData,
				status: "completed",
			})
			.eq("id", workoutId);

		if (workoutError) throw workoutError;

		/**
		 * 2. Prepare sets for bulk insertion.
		 * Since sets are tracked locally without a workout_id reference, we inject the
		 * parent workoutId into each set object to satisfy the Database Foreign Key constraint.
		 */
		const setsToInsert = sets.map((set) => ({
			...set,
			workout_id: workoutId,
		}));

		// Executes a single multi-row INSERT statement for maximum network efficiency.
		const { error: setsError } = await supabase.from("workout_sets").insert(setsToInsert);

		if (setsError) throw setsError;

		return { success: true };
	},
};
