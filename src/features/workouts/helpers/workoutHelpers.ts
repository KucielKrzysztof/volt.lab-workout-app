import { Workout, WorkoutSet, WorkoutUI } from "@/types/workouts";

/**
 * Transforms a raw Workout database record into a simplified UI-ready object.
 * This mapper aggregates nested relational data (sets and exercises) into
 * high-level statistics like total volume, muscle groups, and formatted dates.
 * * @param workout - The raw workout object including nested workout_sets and exercise details.
 * @returns A flattened WorkoutUI object optimized for display in history lists and summaries.
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
