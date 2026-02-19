import { Exercise } from "@/types/exercises";
import { ExerciseListItem } from "./ExerciseListItem";

interface ExerciseListProps {
	exercises: Exercise[];
	searchQuery: string;
	onItemClick?: (exercise: Exercise) => void;
}

/**
 * Renders a scrollable list of exercises.
 * Handles the empty state gracefully when a search returns no results.
 */
export const ExerciseList = ({ exercises, searchQuery, onItemClick }: ExerciseListProps) => {
	if (exercises.length === 0) {
		return (
			<div className="text-center py-20">
				<p className="text-muted-foreground italic">No exercises found for {searchQuery}</p>
			</div>
		);
	}

	return (
		<div className="grid gap-3">
			{exercises.map((ex) => (
				<ExerciseListItem key={ex.id} exercise={ex} onClick={onItemClick} />
			))}
		</div>
	);
};
