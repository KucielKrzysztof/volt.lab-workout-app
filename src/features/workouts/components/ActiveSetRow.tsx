/**
 * @fileoverview Atomic data entry component for individual training sets.
 * Handles the real-time input of performance metrics (weight and repetitions)
 * and synchronizes completion status with the global session store.
 * @module features/workouts/components
 */

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { ActiveSet } from "@/types/exercises";

interface ActiveSetRowProps {
	index: number;
	set: ActiveSet;
	exerciseId: string;
}

/**
 * Renders an interactive row for capturing set-specific performance data.
 * * @description
 * This component is the primary touchpoint for user input during a session. It is
 * bound directly to the `useActiveWorkoutStore`, ensuring that every keystroke
 * or toggle is immediately persisted to the local state and `localStorage`.
 * * **Key Operational Features:**
 * 1. **Bi-directional Binding**: Inputs for weight and reps are controlled components
 * that dispatch updates to the global store on change.
 * 2. **Visual Feedback**: The row dynamically toggles its background color based
 * on the `isCompleted` state to provide clear progress cues.
 * 3. **Input Sanitization**: Weight and Rep values are cast to numbers before
 * being dispatched to the store to maintain data type integrity.
 * * @param {ActiveSetRowProps} props - Component properties.
 * @returns {JSX.Element} A reactive grid row with numeric inputs and a completion toggle.
 */
export const ActiveSetRow = ({ index, set, exerciseId }: ActiveSetRowProps) => {
	/** * Access the atomic update action from the Zustand store.
	 * This action performs a deep-patch on the specific set within the exercise tree.
	 */
	const updateSet = useActiveWorkoutStore((state) => state.updateSet);

	return (
		<div
			className={`grid grid-cols-[30px_1fr_1fr_45px] gap-2 items-center p-2 rounded-xl transition-colors ${
				set.isCompleted ? "bg-primary/10" : "bg-transparent"
			}`}
		>
			{/* Set Positional Indicator (1-based for users) */}
			<span className="font-mono text-[10px] font-bold opacity-30">{index + 1}</span>

			{/* Weight Input (Kilograms) */}
			<Input
				type="number"
				placeholder="0"
				value={set.weight || ""}
				onChange={(e) => updateSet(exerciseId, set.id, { weight: Number(e.target.value) })}
				className="h-8 text-center font-bold bg-background/50 border-primary/5 focus:border-primary/40"
			/>

			{/* Repetition Input */}
			<Input
				type="number"
				placeholder="0"
				value={set.reps || ""}
				onChange={(e) => updateSet(exerciseId, set.id, { reps: Number(e.target.value) })}
				className="h-8 text-center font-bold bg-background/50 border-primary/5 focus:border-primary/40"
			/>

			{/* Completion Toggle */}
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
