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

	getWorkoutById: async (supabase: SupabaseClient, workoutId: string) => {
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
			.eq("id", workoutId)
			.single();
	},

	/**
	
	 */
	finishWorkout: async (
		supabase: SupabaseClient,
		userId: string,
		data: {
			name: string;
			start_time: string;
			completed_at: string;
			duration_seconds: number;
			total_volume: number;
		},
		sets: Array<{
			exercise_id: string;
			weight: number;
			reps: number;
			set_order: number;
		}>,
	) => {
		// 1.
		const { data: workout, error: workoutError } = await supabase
			.from("workouts")
			.insert([
				{
					user_id: userId,
					name: data.name,
					duration_seconds: data.duration_seconds,
					total_volume: data.total_volume,
					started_at: data.start_time,
					completed_at: data.completed_at,
					status: "completed",
				},
			])
			.select()
			.single();

		if (workoutError) throw workoutError;

		// 2.
		const setsToInsert = sets.map((set) => ({
			...set,
			workout_id: workout.id,
		}));

		// Executes a single multi-row INSERT statement for maximum network efficiency.
		const { error: setsError } = await supabase.from("workout_sets").insert(setsToInsert);

		if (setsError) throw setsError;

		return { success: true };
	},
};
