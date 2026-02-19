import { Exercise } from "@/types/exercises";
import { useMemo, useState } from "react";

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
