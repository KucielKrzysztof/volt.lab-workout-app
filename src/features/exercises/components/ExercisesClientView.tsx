"use client";

import { useExercises } from "@/features/exercises/_hooks/use-exercise";
import { useExerciseFilter } from "@/features/exercises/_hooks/use-exercise-filter";
import { ExerciseList } from "@/features/exercises/components/ExerciseList";
import { ExerciseSearch } from "@/features/exercises/components/ExerciseSearch";
import { Exercise } from "@/types/exercises";
import { MuscleGroupFilter } from "./MuscleGroupFilter";
import { ExerciseListSkeleton } from "./ExerciseSkeleton";
import { ExerciseErrorState } from "./ExerciseErrorState";

interface ExercisesClientViewProps {
	initialExercises: Exercise[];
}

/**
 * Main Client-Side View for the Exercise Library.
 * * This component acts as an orchestrator:
 * 1. **Hydration**: Registers server-fetched data into the TanStack Query cache.
 * 2. **State Management**: Manages synchronized search queries and muscle group selections.
 * 4. **UI Composition**: Renders a sticky search bar, horizontal category filter, and an interactive result list.
 * 5. **Error Resilience**: Handles API failures with a dedicated recovery UI.
 * * @param {ExercisesClientViewProps} props - Initial Exercises from server.
 */
export const ExercisesClientView = ({ initialExercises }: ExercisesClientViewProps) => {
	// Synchronize server data with TanStack Query cache
	const { data: exercises, isLoading, isError, error, refetch } = useExercises(initialExercises);

	// Derive comprehensive filtered state (Search + Muscle Groups) from cached data
	const { searchQuery, setSearchQuery, selectedMuscleGroup, setSelectedMuscleGroup, muscleGroups, filteredExercises } = useExerciseFilter(
		exercises || [],
	);

	//  Error State Handled by Isolated Component
	if (isError) {
		return <ExerciseErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />;
	}

	return (
		<div className="w-full flex flex-col justify-stretch space-y-6 animate-in fade-in duration-500  ">
			{/* Sticky Search Interface with real-time results count */}
			<ExerciseSearch value={searchQuery} onChange={setSearchQuery} resultsCount={filteredExercises.length} />
			{/* Horizontal Muscle Group Selector derived from available data */}
			<MuscleGroupFilter groups={muscleGroups} selectedGroup={selectedMuscleGroup} onSelect={setSelectedMuscleGroup} />
			{/* Responsive List Rendering with empty state handling */}
			{isLoading ? <ExerciseListSkeleton /> : <ExerciseList exercises={filteredExercises} searchQuery={searchQuery} />}
		</div>
	);
};
