import { CreateTemplateInput, WorkoutTemplateTable } from "@/types/templates";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service for managing workout blueprints (templates).
 * Handles high-performance relational fetching and atomic bulk persistence
 * for workout routines.
 */
export const templateService = {
	/**
	 * Retrieves all templates for a specific user with full exercise metadata.
	 * Uses a double-nested join to fetch template lines and their exercise details
	 * in a single request.
	 * * @param supabase - Authenticated Supabase client.
	 * @param userId - ID of the user owning the templates.
	 * @returns A promise resolving to a list of joined template objects.
	 */
	getTemplates: async (supabase: SupabaseClient, userId: string) => {
		return supabase
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
			.eq("user_id", userId) // This string returns the 'WorkoutTemplateJoined' structure.
			.order("created_at", { ascending: false });
	},

	/**
	 * Persists a new workout routine header and its associated exercise lines.
	 * Employs a two-step process: header creation followed by a bulk insert of lines
	 * to ensure data integrity.
	 * * @param supabase - Authenticated Supabase client.
	 * @param userId - ID of the user creating the template.
	 * @param name - The title of the routine (e.g., "Upper Body Power").
	 * @param exercises - Array of exercise configurations to be linked to this template.
	 * @returns The newly created template header record.
	 */
	createTemplate: async (
		supabase: SupabaseClient,
		userId: string,
		name: string,
		exercises: CreateTemplateInput["exercises"],
	): Promise<WorkoutTemplateTable> => {
		/**
		 * 1. Create the template header.
		 * We use .single() to return the object directly for immediate use in the next step.
		 */
		const { data: template, error: tError } = await supabase
			.from("workout_templates")
			.insert([{ user_id: userId, name }])
			.select()
			.single();

		if (tError) throw tError;

		/**
		 * 2. Prepare and Bulk Insert exercise lines.
		 * We map the input array to inject the 'template_id' and satisfy the
		 * Database Foreign Key constraint.
		 */
		const exercisesToInsert = exercises.map((ex, index) => ({
			template_id: template.id,
			exercise_id: ex.exercise_id, // Zmienione z .id
			order: index,
			suggested_sets: ex.suggested_sets, // Zmienione z .sets
			suggested_reps: ex.suggested_reps, // Zmienione z .reps
			notes: ex.notes || null,
		}));

		const { error: eError } = await supabase.from("template_exercises").insert(exercisesToInsert); // Single multi-row insert for network efficiency.

		if (eError) throw eError;

		return template;
	},
};
