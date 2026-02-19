import { Dumbbell } from "lucide-react";
import { Exercise } from "@/types/exercises";
import { cn } from "@/lib/utils";

interface ExerciseListItemProps {
	exercise: Exercise;
	onClick?: (exercise: Exercise) => void;
	rightElement?: React.ReactNode;
}

export const ExerciseListItem = ({ exercise, onClick, rightElement }: ExerciseListItemProps) => {
	return (
		<div
			onClick={() => onClick?.(exercise)}
			className={cn(
				"w-full group flex items-center justify-between p-4 bg-secondary/10 border border-white/5 rounded-2xl",
				"hover:bg-secondary/20 hover:border-primary/20 transition-all cursor-pointer active:scale-[0.98]",
			)}
		>
			<div className="flex items-center gap-4">
				<div className="p-2 rounded-lg bg-background border border-white/5 group-hover:text-primary transition-colors">
					<Dumbbell size={20} />
				</div>
				<div>
					<h3 className="font-bold uppercase tracking-tight text-sm md:text-base">{exercise.name}</h3>
					<p className="text-[10px] text-primary/60 font-black uppercase tracking-tighter">{exercise.muscle_group}</p>
				</div>
			</div>
			{rightElement}
		</div>
	);
};
