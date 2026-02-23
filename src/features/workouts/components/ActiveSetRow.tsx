import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { ActiveSet } from "@/types/exercises";

interface ActiveSetRowProps {
	index: number;
	set: ActiveSet;
	exerciseId: string;
}

export const ActiveSetRow = ({ index, set, exerciseId }: ActiveSetRowProps) => {
	const updateSet = useActiveWorkoutStore((state) => state.updateSet);

	return (
		<div
			className={`grid grid-cols-[30px_1fr_1fr_45px] gap-2 items-center p-2 rounded-xl transition-colors ${set.isCompleted ? "bg-primary/10" : "bg-transparent"}`}
		>
			<span className="font-mono text-[10px] font-bold opacity-30">{index + 1}</span>
			<Input
				type="number"
				placeholder="0"
				value={set.weight || ""}
				onChange={(e) => updateSet(exerciseId, set.id, { weight: Number(e.target.value) })}
				className="h-8 text-center font-bold bg-background/50 border-primary/5 focus:border-primary/40"
			/>
			<Input
				type="number"
				placeholder="0"
				value={set.reps || ""}
				onChange={(e) => updateSet(exerciseId, set.id, { reps: Number(e.target.value) })}
				className="h-8 text-center font-bold bg-background/50 border-primary/5 focus:border-primary/40"
			/>
			<div className="flex justify-end">
				<Checkbox
					checked={set.isCompleted}
					onCheckedChange={(checked) => updateSet(exerciseId, set.id, { isCompleted: !!checked })}
					className="h-6 w-6 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
				/>
			</div>
		</div>
	);
};
