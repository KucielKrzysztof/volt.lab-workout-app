import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActiveSetRow } from "./ActiveSetRow";
import { ActiveExercise } from "@/types/exercises";

export const ActiveExerciseCard = ({ exercise }: { exercise: ActiveExercise }) => {
	const addSet = useActiveWorkoutStore((state) => state.addSet);

	return (
		<div className="bg-secondary/5 border border-primary/10 rounded-2xl overflow-hidden">
			<div className="p-4 bg-secondary/10 border-b border-primary/5 flex justify-between items-center">
				<h3 className="font-black uppercase italic text-sm tracking-tight">{exercise.name}</h3>
				<Button variant="ghost" size="sm" onClick={() => addSet(exercise.id)} className="h-7 text-[10px] uppercase font-bold text-primary">
					<Plus size={14} className="mr-1" /> Add Set
				</Button>
			</div>

			<div className="p-2 space-y-1">
				<div className="grid grid-cols-[30px_1fr_1fr_45px] gap-2 px-2 mb-1 text-[8px] uppercase font-black text-muted-foreground tracking-widest">
					<span>Set</span>
					<span className="text-center">KG</span>
					<span className="text-center">Reps</span>
					<span className="text-right">Done</span>
				</div>
				{exercise.sets.map((set, index) => (
					<ActiveSetRow key={set.id} index={index} set={set} exerciseId={exercise.id} />
				))}
			</div>
		</div>
	);
};
