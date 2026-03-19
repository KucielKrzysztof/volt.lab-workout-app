/**
 * @fileoverview Data Portability Service.
 * Implements parallel aggregation of relational data with strict type safety.
 * @module services/apiExport
 */

import { UserProfile } from "@/types/profile";
import { Workout } from "@/types/workouts";
import { WorkoutTemplateJoined } from "@/types/templates";
import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";

/**
 * @interface UserExportPayload
 * @description The strictly typed structure of the exported user data.
 * Merges raw database entities and joined relational models.
 */
export interface UserExportPayload {
	metadata: {
		exported_at: string;
		version: string;
		user_id: string;
	};
	profile: UserProfile;
	workouts: Workout[];
	templates: WorkoutTemplateJoined[];
}

export const exportService = {
	/**
	 * Aggregates all user-related entities into a single unified export payload.
	 * * @description
	 * Executes parallel independent queries to bypass PostgREST join limitations.
	 * Results are mapped directly to 'Workout' and 'WorkoutTemplateJoined' types.
	 * * @param {SupabaseClient} supabase - Authenticated client instance.
	 * @param {string} userId - Target user UUID.
	 * @returns {Promise<UserExportPayload>} A structured and typed JSON payload.
	 */
	async getFullUserExport(supabase: SupabaseClient, userId: string): Promise<UserExportPayload> {
		const [profileRes, workoutsRes, templatesRes] = await Promise.all([
			// 1. Profile Data (UserProfile)
			supabase.from("profiles").select("*").eq("id", userId).single(),

			// 2. Full Workout History (Workout[])
			// Matches the 'Workout' interface which expects 'workout_sets' and nested 'exercises'
			supabase
				.from("workouts")
				.select(
					`
                *,
                workout_sets (
                    *,
                    exercises (name, muscle_group)
                )
            `,
				)
				.eq("user_id", userId)
				.order("started_at", { ascending: false }),

			// 3. User Templates (WorkoutTemplateJoined[])
			// Updated select to include 'muscle_group' to fully satisfy the interface
			supabase
				.from("workout_templates")
				.select(
					`
                *,
                template_exercises (
                    *,
                    exercises (name, muscle_group)
                )
            `,
				)
				.eq("user_id", userId),
		]);

		// Error Aggregation
		if (profileRes.error) throw profileRes.error;
		if (workoutsRes.error) throw workoutsRes.error;
		if (templatesRes.error) throw templatesRes.error;

		/** * Type-Safe Payload Construction:
		 * Since our SQL selects match the interfaces, we can safely cast the results.
		 */
		return {
			metadata: {
				exported_at: new Date().toISOString(),
				version: "1.0.0",
				user_id: userId,
			},
			profile: profileRes.data as UserProfile,
			workouts: (workoutsRes.data || []) as Workout[],
			templates: (templatesRes.data || []) as WorkoutTemplateJoined[],
		};
	},

	// --- Custom export  for future: eg. only Profile, only Exercises etc...

	/**
	 * Generic wrapper for custom export shapes.
	 * Eliminates 'any' by utilizing the official Supabase PostgrestError interface.
	 * * @template T - The expected data structure.
	 * @param {Promise<{ data: T | null; error: PostgrestError | null }>} query - The Supabase query promise.
	 * @returns {Promise<T>} The resolved data or throws a PostgrestError.
	 */
	async getGenericExport<T>(query: Promise<{ data: T | null; error: PostgrestError | null }>): Promise<T> {
		const { data, error } = await query;

		if (error) {
			// Now 'error' is strictly PostgrestError, giving access to .message, .code, etc.
			throw error;
		}

		if (!data) {
			throw new Error("No data found for the provided export query.");
		}

		return data;
	},
};
