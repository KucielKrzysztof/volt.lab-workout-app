/**
 * @fileoverview Exercise Domain Type System.
 * Defines the models for the global exercise library and the reactive,
 * transient state used during live workout sessions.
 * @module types/exercises
 */

import { WorkoutSet } from "./workouts";

/**
 * Represents a read-only entity from the master exercise library.
 * * @description
 * This interface maps 1:1 to the `exercises` table in Supabase. It acts as the
 * "Blueprint" for any movement that can be added to a routine or session.
 * @interface Exercise
 * @property {string} id - The UUID primary key from the database.
 * @property {string} name - The canonical name of the exercise (e.g., "Deadlift").
 * @property {string} muscle_group - The primary anatomical category (e.g., "Back").
 */
export interface Exercise {
	id: string;
	name: string;
	muscle_group: string;
}

/**
 * The atomic unit of performance tracking during a live session.
 * * @description
 * Represents a single performance "Set". Unlike historical records, this type
 * is highly mutable and exists primarily in the client-side state until the
 * workout is finalized.
 * @interface ActiveSet
 * @property {string} id - A local unique identifier (usually crypto.randomUUID()) used for stable React keys.
 * @property {number} weight - The load used in kilograms (kg).
 * @property {number} reps - The number of successful repetitions completed.
 * @property {boolean} isCompleted - Toggle flag for the UI to indicate the set is "done" and ready for persistence.
 */
export interface ActiveSet {
	id: string;
	weight: number;
	reps: number;
	isCompleted: boolean;
}

/**
 * Orchestrator for a specific movement within an active workout.
 * * @description
 * This is a composite type that bridges the static library data with the
 * dynamic performance data. It uses a dual-ID strategy to maintain UI stability
 * while ensuring relational integrity during the final save.
 * * @interface ActiveExercise
 * @property {string} id - Local unique ID (randomUUID). Essential for handling duplicate exercises in a single session (e.g., two separate blocks of Bench Press).
 * @property {string} exercise_id - The foreign key pointing to the master `Exercise` entity in Supabase.
 * @property {string} name - Cached name from the library to prevent excessive joins/lookups during the live session.
 * @property {ActiveSet[]} sets - A reactive array of performance metrics for this specific exercise instance.
 */
export interface ActiveExercise {
	id: string;
	exercise_id: string;
	name: string;
	sets: ActiveSet[];
}

/**
 * Represents a collection of sets grouped by a specific movement
 * for historical analysis and display.
 */
export interface GroupedWorkoutExercise {
	name: string;
	muscle_group: string;
	sets: WorkoutSet[];
}
