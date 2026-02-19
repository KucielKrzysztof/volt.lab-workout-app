"use client";

import { useExercises } from "@/features/exercises/_hooks/use-exercise";
import { useExerciseFilter } from "@/features/exercises/_hooks/use-exercise-filter";
import { ExerciseList } from "@/features/exercises/components/ExerciseList";
import { ExerciseSearch } from "@/features/exercises/components/ExerciseSearch";
import { Exercise } from "@/types/exercises";

interface ExercisesClientViewProps {
	initialExercises: Exercise[];
}

/**
 * Main Client-Side View for the Exercise Library.
 * * This component acts as an orchestrator:
 * 1. It registers the server-fetched data into TanStack Query.
 * 2. It passes the managed state into the filtering logic.
 * 3. It renders the search interface and the list.
 */
export const ExercisesClientView = ({ initialExercises }: ExercisesClientViewProps) => {
	// Synchronize server data with TanStack Query cache
	const { data: exercises } = useExercises(initialExercises);

	// Derive filtered state from the cached exercises
	const { searchQuery, setSearchQuery, filteredExercises } = useExerciseFilter(exercises || []);

	return (
		<div className="w-full flex flex-col justify-stretch space-y-6 animate-in fade-in duration-500  ">
			<ExerciseSearch value={searchQuery} onChange={setSearchQuery} resultsCount={filteredExercises.length} />

			<ExerciseList exercises={filteredExercises} searchQuery={searchQuery} onItemClick={(ex) => console.log("Selected:", ex.name)} />
		</div>
	);
};
