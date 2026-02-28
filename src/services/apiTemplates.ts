/**
 * @fileoverview Service for managing training blueprints and routine configurations.
 * Orchestrates high-performance data retrieval and multi-stage persistence
 * for the workout template engine in the VOLT.LAB ecosystem.
 * @module services/apiTemplates
 */

import { CreateTemplateInput, WorkoutTemplateTable } from "@/types/templates";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Core service for handling workout routine definitions (blueprints).
 * * @description
 * This service manages the lifecycle of training templates, utilizing optimized
 * relational joins for fetching and atomic batch operations for persistence
 * to ensure a seamless "blueprint-to-session" workflow.
 */
export const templateService = {
	/**
	 * Retrieves all workout templates for a specific user, including deep exercise metadata.
	 * * @description
	 * Executes a double-nested relational join to reconstruct the full routine
	 * hierarchy in a single network round-trip.
	 * * **Query Architecture:**
	 * 1. Selects the base `workout_templates`.
	 * 2. Joins `template_exercises` (junction table).
	 * 3. Joins `exercises` library to retrieve movement names and target muscles.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} userId - UUID of the user requesting their routine library.
	 * @returns {Promise<Object>} A promise resolving to an array of relational `WorkoutTemplateJoined` objects.
	 * * @example
	 * const templates = await templateService.getTemplates(supabase, 'user-123');
	 * // Returns templates with nested exercises sorted by creation date (descending).
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
			.eq("user_id", userId) // Scopes results to the authenticated user's ID.
			.order("created_at", { ascending: false });
	},

	/**
	 * Persists a new workout routine header and its associated exercise configurations.
	 * * @description
	 * Implements a robust two-stage atomic persistence workflow to ensure data integrity:
	 * * **Stage 1: Header Initialization**
	 * Creates the parent record in `workout_templates` and retrieves the unique UUID.
	 * * **Stage 2: Relational Bulk Insert**
	 * Maps the input array to inject the parent `template_id` and performs a
	 * single multi-row insert into `template_exercises` for maximum efficiency.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} userId - UUID of the user creating the blueprint.
	 * @param {string} name - The descriptive title of the routine (e.g., "Push Day Focus").
	 * @param {CreateTemplateInput["exercises"]} exercises - Array of exercise IDs and suggested volumes (sets/reps).
	 * @returns {Promise<WorkoutTemplateTable>} The newly created template header record.
	 * * @throws Will throw an error if either the header creation or the bulk line insert fails.
	 */
	createTemplate: async (
		supabase: SupabaseClient,
		userId: string,
		name: string,
		exercises: CreateTemplateInput["exercises"],
	): Promise<WorkoutTemplateTable> => {
		/**
		 * Stage 1: Create the template header.
		 * Uses `.single()` to return the object directly for FK injection in Stage 2.
		 */
		const { data: template, error: tError } = await supabase
			.from("workout_templates")
			.insert([{ user_id: userId, name }])
			.select()
			.single();

		if (tError) throw tError;

		/**
		 * Stage 2: Prepare and Bulk Insert exercise configuration lines.
		 * Maps the input to the database schema, satisfying Foreign Key constraints.
		 */
		const exercisesToInsert = exercises.map((ex, index) => ({
			template_id: template.id,
			exercise_id: ex.exercise_id,
			order: index, // Preserves the intended exercise sequence.
			suggested_sets: ex.suggested_sets,
			suggested_reps: ex.suggested_reps,
			notes: ex.notes || null,
		}));

		// Multi-row INSERT statement reduces network latency and transaction time.
		const { error: eError } = await supabase.from("template_exercises").insert(exercisesToInsert);

		if (eError) throw eError;

		return template;
	},
};
