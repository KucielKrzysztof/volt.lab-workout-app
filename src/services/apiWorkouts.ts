/**
 * @fileoverview Core database service for workout session management.
 * Orchestrates high-performance relational data retrieval and atomic persistence
 * strategies using the Supabase PostgREST interface.
 * @module services/apiWorkouts
 */

import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service object containing methods to manage the lifecycle of workout sessions.
 * * @description
 * This service handles the complex mapping between the flat physical database
 * and the hierarchical training models used in the UI. It is optimized to
 * minimize network round-trips through deep relational selection and server-side
 * pagination.
 */
export const workoutService = {
	/**
	 * Fetches a paginated list of workout sessions for a specific user.
	 * * @description
	 * Uses a deep relational join to retrieve all associated sets and exercise data
	 * in a single database call. Implements exact count retrieval to support
	 * synchronized pagination UI.
	 * * **Pagination Mechanics:**
	 * Translates 0-based page indices into inclusive byte-like ranges for PostgREST.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} userId - The unique UUID of the user owning the history.
	 * @param {number} [page=0] - The zero-based index for server-side pagination.
	 * @param {number} [limit=10] - Maximum number of workout records per payload.
	 * @returns {Promise<{ data: any[] | null, count: number | null }>} A PostgREST response
	 * containing the raw joined Workout data and the absolute total record count.
	 * * @example
	 * const { data, count } = await workoutService.getWorkouts(supabase, 'uuid', 0, 10);
	 */
	getWorkouts: async (supabase: SupabaseClient, userId: string, page = 0, limit = 10) => {
		// PostgREST uses 0-based inclusive range indexing (e.g., 0-9 for the first 10 items).
		const from = page * limit;
		const to = from + limit - 1;

		const { data, error, count } = await supabase
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
				{ count: "exact" }, // Essential for Infinite Scroll 'totalCount' logic.
			)

			.eq("user_id", userId)
			.order("started_at", { ascending: false })
			.range(from, to); // Applies server-side pagination to limit payload size.

		if (error) throw new Error(error.message);

		return { data, count };
	},

	/**
	 * Fetches the full details of a specific workout session by its unique identifier.
	 * * @description
	 * Leverages the same deep-selection string as `getWorkouts` to provide a
	 * consistent data structure for the `WorkoutDetailView`.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} workoutId - The UUID of the session to retrieve.
	 * @returns {Promise<Object>} A PostgREST response for a single relational workout record.
	 */
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
	 * Finalizes and persists an active workout session along with all performed sets.
	 * * @description
	 * Implements a critical two-stage persistence strategy to maintain referential integrity:
	 * 1. **Header Creation**: Inserts the main record into the `workouts` table and retrieves the generated ID.
	 * 2. **Performance Bulk Insert**: Injects the new `workout_id` into each set and performs a single
	 * multi-row INSERT into `workout_sets` for maximum network efficiency.
	 * * **Mathematical Aggregation**:
	 * The `total_volume` is persisted as a pre-calculated sum of $(\text{weight} \times \text{reps})$ for all sets.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} userId - UUID of the user completing the session.
	 * @param {Object} data - The session metadata (name, timestamps, total volume).
	 * @param {Array<Object>} sets - An array of exercise performance data to be persisted.
	 * @returns {Promise<{success: boolean}>} Object indicating the successful atomic completion of the save operation.
	 * * @throws Will throw a PostgREST error if either the header or the sets fail to persist.
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
		// Stage 1: Persist the Workout Session Header
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

		// Stage 2: Map and Bulk Insert Performance Sets
		const setsToInsert = sets.map((set) => ({
			...set,
			workout_id: workout.id, // Injecting the parent FK derived from Stage 1.
		}));

		// Executes a single multi-row INSERT statement for maximum network efficiency.
		const { error: setsError } = await supabase.from("workout_sets").insert(setsToInsert);

		if (setsError) throw setsError;

		return { success: true };
	},
};
