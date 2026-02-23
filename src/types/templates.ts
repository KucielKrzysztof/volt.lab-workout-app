/**
 * STRICT DATABASE TYPES
 * These reflect the exact columns in your Supabase tables.
 */

/** Represents a single row in the 'workout_templates' table. */
export interface WorkoutTemplateTable {
	id: string;
	user_id: string;
	name: string;
	description: string | null;
	created_at: string;
}

/** Represents a single row in the 'template_exercises' table. */
export interface TemplateExerciseTable {
	id: string;
	template_id: string;
	exercise_id: string;
	notes: string | null;
	/** The display sequence within the template. */
	order: number;
	suggested_sets: number;
	suggested_reps: number;
	created_at: string;
}

/**
 * JOINED API TYPES
 * These represent the nested objects returned by Supabase 'select' queries.
 */

/** A template including its joined list of exercises. */
export interface WorkoutTemplateJoined extends WorkoutTemplateTable {
	/** Nested rows from 'template_exercises'. */
	template_exercises: (TemplateExerciseTable & {
		/** Nested metadata from the 'exercises' table. */
		exercises: {
			name: string;
			muscle_group: string;
		} | null;
	})[];
}

/**
 * UI / PRESENTATION TYPES
 * Flattened and optimized for React components.
 */

/** A simplified model for template cards and lists. */
export interface WorkoutTemplateUI {
	id: string;
	name: string;
	description: string | null;
	/** Aggregated list of unique muscle groups (e.g., ["Chest", "Triceps"]). */
	muscles: string[];
	exerciseCount: number;
	/** A short string preview of exercise names for the card. */
	exercises: {
		id: string;
		name: string;
		sets: number;
		reps: number;
	}[];
}

/**
 * FORM / INPUT TYPES
 * Used specifically for the creation process.
 */
export interface CreateTemplateInput {
	name: string;
	exercises: {
		exercise_id: string;
		suggested_sets: number;
		suggested_reps: number;
		notes?: string;
	}[];
}
