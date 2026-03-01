/**
 * @fileoverview Template Type System for VOLT.LAB.
 * Defines the data structures for workout blueprints, ranging from raw
 * PostgreSQL table rows to flattened UI models and mutation payloads.
 * @module types/templates
 */

/**
 * ##########################################
 * #         STRICT DATABASE TYPES          #
 * ##########################################
 * These reflect the exact columns in your Supabase tables.
 */

/**
 * Represents a single row in the 'workout_templates' table.
 * @interface WorkoutTemplateTable
 * @property {string} id - UUID primary key.
 * @property {string} user_id - UUID foreign key linking to auth.users.
 * @property {string} name - The display name of the routine (e.g., "Push Day").
 * @property {string | null} description - Optional context or goals for the routine.
 * @property {string} created_at - ISO timestamp of record creation.
 */
export interface WorkoutTemplateTable {
	id: string;
	user_id: string;
	name: string;
	description: string | null;
	created_at: string;
}

/**
 * Represents a single row in the 'template_exercises' table.
 * @interface TemplateExerciseTable
 * @property {string} id - UUID primary key.
 * @property {string} template_id - Foreign key linking to 'workout_templates'.
 * @property {string} exercise_id - Foreign key linking to the global 'exercises' library.
 * @property {string | null} notes - Specific cues or instructions for this exercise in this routine.
 * @property {number} order - The display sequence (sorting) within the template.
 * @property {number} suggested_sets - Default set count to be populated during a live session.
 * @property {number} suggested_reps - Default rep count to be populated during a live session.
 * @property {string} created_at - ISO timestamp.
 */
export interface TemplateExerciseTable {
	id: string;
	template_id: string;
	exercise_id: string;
	notes: string | null;
	order: number;
	suggested_sets: number;
	suggested_reps: number;
	created_at: string;
}

/**
 * ##########################################
 * #           JOINED API TYPES             #
 * ##########################################
 * These represent the nested objects returned by Supabase 'select' queries.
 */

/**
 * A comprehensive template object including its joined relational data.
 * * @description
 * This type is the direct output of deep PostgREST joins. It includes the
 * template metadata, all associated exercises, and the metadata for those
 * exercises (like names and muscle groups)
 * @interface WorkoutTemplateJoined
 * @extends WorkoutTemplateTable
 */
export interface WorkoutTemplateJoined extends WorkoutTemplateTable {
	/** * Nested rows from 'template_exercises' combined with 'exercises' metadata.
	 */
	template_exercises: (TemplateExerciseTable & {
		/** * Joined metadata from the global exercise library.
		 * @property {string} name - The canonical name of the movement.
		 * @property {string} muscle_group - The primary anatomical focus.
		 */
		exercises: {
			name: string;
			muscle_group: string;
		} | null;
	})[];
}

/**
 * ##########################################
 * #       UI / PRESENTATION TYPES          #
 * ##########################################
 * Flattened and optimized for React components.
 */

/**
 * A simplified, flattened model for template cards and lists.
 * * @description
 * Created via the `mapTemplateForUI` helper. This model is optimized for
 * frontend performance, eliminating the need for components to traverse
 * deeply nested arrays.
 * @interface WorkoutTemplateUI
 * @property {string[]} muscles - Aggregated, unique list of muscle groups (e.g., ["Chest", "Triceps"]).
 * @property {number} exerciseCount - Total count of exercises in this routine.
 */
export interface WorkoutTemplateUI {
	id: string;
	name: string;
	description: string | null;
	muscles: string[];
	exerciseCount: number;
	/** * Flat list of exercises with essential volume metrics for the card view.
	 */
	exercises: {
		id: string;
		name: string;
		sets: number;
		reps: number;
	}[];
}

/**
 * ##########################################
 * #           FORM / INPUT TYPES           #
 * ##########################################
 * Used specifically for the creation and update process.
 */

/**
 * Data structure required to persist a new workout routine.
 * * @description
 * Maps directly to the `templateService.createTemplate` method. Focuses on
 * the 'write' requirements of the database.
 * @interface CreateTemplateInput
 */
export interface CreateTemplateInput {
	name: string;
	/** * Collection of exercise configurations to be bulk-inserted.
	 */
	exercises: {
		exercise_id: string;
		suggested_sets: number;
		suggested_reps: number;
		notes?: string;
	}[];
}
