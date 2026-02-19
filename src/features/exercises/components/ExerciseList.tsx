import { Exercise } from "@/types/exercises";
import { ExerciseListItem } from "./ExerciseListItem";

interface ExerciseListProps {
	exercises: Exercise[];
	searchQuery: string;
	onItemClick?: (exercise: Exercise) => void;
}

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
