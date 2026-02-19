"use client";

import { useExercises } from "@/features/exercises/_hooks/use-exercise";
import { useExerciseFilter } from "@/features/exercises/_hooks/use-exercise-filter";
import { ExerciseList } from "@/features/exercises/components/ExerciseList";
import { ExerciseSearch } from "@/features/exercises/components/ExerciseSearch";
import { Exercise } from "@/types/exercises";

interface ExercisesClientViewProps {
	initialExercises: Exercise[];
}

export const ExercisesClientView = ({ initialExercises }: ExercisesClientViewProps) => {
	const { data: exercises } = useExercises(initialExercises);

	const { searchQuery, setSearchQuery, filteredExercises } = useExerciseFilter(exercises || []);

	return (
		<div className="w-full flex flex-col justify-stretch space-y-6 animate-in fade-in duration-500  ">
			<ExerciseSearch value={searchQuery} onChange={setSearchQuery} resultsCount={filteredExercises.length} />

			<ExerciseList exercises={filteredExercises} searchQuery={searchQuery} onItemClick={(ex) => console.log("Selected:", ex.name)} />
		</div>
	);
};
