import { Exercise } from "@/types/exercises";
import { useMemo, useState } from "react";

/**
 * Custom hook to manage the UI logic for filtering exercises.
 * * * Performance: Uses useMemo to ensure that complex filtering and set operations
 * only re-run when their specific dependencies change.
 * * * Features:
 * 1. **Text Search**: Case-insensitive matching against exercise names.
 * 2. **Muscle Group Selection**: Categorical filtering based on the 'muscle_group' field.
 * 3. **Dynamic Discovery**: Automatically derives a unique list of available muscle groups from the dataset.
 * * @param {Exercise[]} initialExercises - The complete dataset fetched from the server/cache.
 * @returns {Object} An object containing filtering states, setters, and the computed results.
 */
export const useExerciseFilter = (initialExercises: Exercise[]) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

	/**
	 * Derives a unique, sorted list of muscle groups present in the current dataset.
	 */
	const muscleGroups = useMemo(() => {
		const groups = initialExercises.map((ex) => ex.muscle_group);
		return Array.from(new Set(groups)).sort();
	}, [initialExercises]);

	/**
	 * Computed subset of exercises based on active filters.
	 * * 1. Performance: Memoized to prevent heavy re-computations unless dependencies change.
	 * 2. Search Logic: Performs a case-insensitive name match.
	 * 3. Muscle Logic:
	 * - If 'selectedMuscleGroup' is null (All), the filter is bypassed (!null = true).
	 * - Otherwise, it enforces a strict equality match with the exercise data.
	 * 4. Combined Logic: Uses '&&' (AND) to ensure items must pass BOTH criteria to be displayed.
	 */
	const filteredExercises = useMemo(() => {
		return initialExercises.filter((ex) => {
			// Case-insensitive search match
			const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());

			// Bypass if null (All), otherwise match selected group
			const matchesMuscle = !selectedMuscleGroup || ex.muscle_group === selectedMuscleGroup;

			// Both conditions must be met (Intersection logic)
			return matchesSearch && matchesMuscle;
		});
	}, [searchQuery, initialExercises, selectedMuscleGroup]);

	return {
		/** Current text input for searching. */
		searchQuery,
		/** Function to update the search text. */
		setSearchQuery,
		/** Currently active muscle group filter (null means 'All'). */
		selectedMuscleGroup,
		/** Function to switch the active muscle group. */
		setSelectedMuscleGroup,
		/** List of unique muscle groups available for the UI filter. */
		muscleGroups,
		/** The resulting list of exercises after all filters are applied. */
		filteredExercises,
	};
};
