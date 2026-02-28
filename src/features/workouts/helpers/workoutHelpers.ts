/**
 * @fileoverview Data transformation layer for workout sessions.
 * Provides mapping and grouping utilities to convert raw relational database records
 * from Supabase into optimized, localized, and deduplicated UI models.
 * @module features/workouts/helpers
 */

import { Workout, WorkoutSet, WorkoutUI } from "@/types/workouts";

/**
 * Transforms a raw Workout database record into a flattened, UI-ready object.
 * * @description
 * This mapper acts as a synchronization bridge between the database and the UI.
 * It performs real-time aggregation of nested relational data
 * to provide immediate statistics for history lists and summary cards.
 * * @param {Workout} workout - The raw session object containing joined performance sets and exercise metadata.
 * @returns {WorkoutUI} A flattened object with calculated stats, unique muscle lists, and localized dates.
 * * @example
 * const raw = { started_at: '2026-02-28T12:00:00Z', workout_sets: [...] };
 * const ui = mapWorkoutForUI(raw);
 * console.log(ui.displayDate); // "28.02.2026"
 * console.log(ui.exerciseCount); // 5 (unique movements)
 */
export const mapWorkoutForUI = (workout: Workout): WorkoutUI => {
	// Ensure sets is always an array to prevent mapping errors on empty sessions.
	const sets = workout.workout_sets || [];

	/**
	 * Extraction and Deduplication:
	 * We extract the nested exercise metadata and use a Set to ensure that
	 * even if a user does 5 sets of Bench Press, "Chest" only appears once.
	 */
	const exercisesData = sets.map((s) => s.exercises).filter(Boolean);

	// Create an array of unique muscle groups targeted in this session.
	const muscles = [...new Set(exercisesData.map((e) => e!.muscle_group))];

	// Create an array of unique exercise names to determine the variety of the workout.
	const uniqueExercises = [...new Set(exercisesData.map((e) => e!.name))];

	return {
		...workout, // Pass through base database fields (id, name, volume, etc.).

		/** Calculated UI Fields: */
		muscles,
		exerciseCount: uniqueExercises.length,
		totalSets: sets.length,

		/**
		 * Date Localization:
		 * Converts the ISO timestamp from Supabase into a human-readable format
		 * specific to the Polish locale.
		 */
		displayDate: new Date(workout.started_at).toLocaleDateString("pl-PL", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}),
	};
};

interface GroupedExercise {
	exerciseId: string;
	name: string;
	muscle_group: string;
	sets: WorkoutSet[];
}

/**
 * Aggregates a flat array of performance sets into hierarchical groups by exercise.
 * * @description
 * Crucial for the `WorkoutDetailView`. It reverses the flat database structure to
 * group every set under its parent exercise header, while maintaining the chronological
 * order of the workout.
 * * **Sorting Algorithm:**
 * Groups are sorted by the `set_order` of the first set within each group,
 * ensuring the UI renders exercises in the exact sequence they were performed.
 * * @param {WorkoutSet[]} sets - The collection of sets retrieved for a specific session.
 * @returns {GroupedExercise[]} A collection of exercise-headed groups, sorted by performance order.
 * * @example
 * const grouped = groupSetsByExercise(workout.workout_sets);
 * grouped.map(ex => console.log(`${ex.name}: ${ex.sets.length} sets`));
 */
export const groupSetsByExercise = (sets: WorkoutSet[]): GroupedExercise[] => {
	const groups: Record<string, GroupedExercise> = {};

	sets.forEach((set) => {
		const exerciseId = set.exercise_id;
		if (!groups[exerciseId]) {
			groups[exerciseId] = {
				exerciseId,
				name: set.exercises?.name ?? "Unknown Exercise",
				muscle_group: set.exercises?.muscle_group ?? "Mixed",
				sets: [],
			};
		}
		groups[exerciseId].sets.push(set);
	});

	return Object.values(groups).sort((a, b) => {
		const orderA = a.sets[0]?.set_order ?? 0;
		const orderB = b.sets[0]?.set_order ?? 0;
		return orderA - orderB;
	});
};
