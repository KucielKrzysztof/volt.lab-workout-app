/**
 * @fileoverview Editable row component for the Workout Template Creator.
 * Handles the granular configuration of suggested volume (sets and reps)
 * for a specific movement within a routine blueprint.
 * @module features/templates/components
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TemplateExerciseRowProps {
	exercise: { id: string; name: string; suggested_sets: number; suggested_reps: number };
	onUpdate: (id: string, updates: Partial<{ suggested_sets: number; suggested_reps: number }>) => void;
	onRemove: (id: string) => void;
}

/**
 * Renders an interactive configuration card for an exercise in a template draft.
 * * @description
 * This component acts as a controlled input group. It allows users to define the
 * "suggested volume" that will later be used to hydrate an active workout session.
 * It ensures that every movement in a routine has a baseline set/rep target.
 * * **Key Operational Features:**
 * 1. **Atomic Updates**: Uses a partial update pattern via `onUpdate` to modify
 * specific numeric fields without affecting other properties of the exercise.
 * 2. **Input Sanitization**: Explicitly casts string input values to `Number`
 * before bubbling state changes up to the `TemplateCreator`.
 * 3. **Sequence Management**: Provides a destructive action (`onRemove`) to
 * prune the routine's exercise list.
 * * @param {TemplateExerciseRowProps} props - Component properties.
 * @returns {JSX.Element} A themed card with numeric inputs for sets/reps and a removal trigger.
 */
export const TemplateExerciseRow = ({ exercise, onUpdate, onRemove }: TemplateExerciseRowProps) => {
	return (
		<div className="p-4 bg-secondary/10 border border-primary/10 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
			<div className="flex justify-between items-center">
				<p className="font-black uppercase italic text-sm tracking-tight text-primary">{exercise.name}</p>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => onRemove(exercise.id)}
					className="text-muted-foreground hover:text-destructive transition-colors"
				>
					<Trash2 size={16} />
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-1">Sets</label>
					<Input
						type="number"
						value={exercise.suggested_sets}
						onChange={(e) => onUpdate(exercise.id, { suggested_sets: Number(e.target.value) })}
						className="bg-background/50 border-primary/10 font-mono font-bold"
					/>
				</div>
				<div className="space-y-1">
					<label className="text-[10px] uppercase font-bold tracking-widest opacity-50 ml-1">Reps</label>
					<Input
						type="number"
						value={exercise.suggested_reps}
						onChange={(e) => onUpdate(exercise.id, { suggested_reps: Number(e.target.value) })}
						className="bg-background/50 border-primary/10 font-mono font-bold"
					/>
				</div>
			</div>
		</div>
	);
};
