import { Exercise } from "@/types/exercises";
import { useMemo, useState } from "react";

/**
 * UI logic hook for filtering the exercise list.
 * * Uses useMemo to optimize performance, ensuring filtering calculations
 * only run when the search query or the base data changes.
 * * @param initialExercises - The full list of exercises to be filtered.
 */
export const useExerciseFilter = (initialExercises: Exercise[]) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredExercises = useMemo(() => {
		return initialExercises.filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [searchQuery, initialExercises]);

	return {
		searchQuery,
		setSearchQuery,
		filteredExercises,
	};
};
