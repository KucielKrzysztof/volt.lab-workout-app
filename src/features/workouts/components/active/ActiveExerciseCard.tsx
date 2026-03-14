/**
 * @fileoverview Interactive exercise container for the active workout workspace.
 * Responsible for the display of individual movements and
 * managing the addition of new performance sets within a live session.
 * @module features/workouts/components
 */

import { useActiveWorkoutStore } from "../../_hooks/use-active-workout-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActiveSetRow } from "./ActiveSetRow";
import { ActiveExercise } from "@/types/exercises";

/**
 * @Component that renders a specific exercise block during an active training session.
 * * @description
 * This component acts as a structural hub for a single movement (e.g., "Bench Press").
 * It interfaces directly with the `useActiveWorkoutStore` to facilitate real-time
 * state updates and provides a consistent grid layout for performance data entry.
 * * **Key Responsibilities:**
 * 1. **Header Management**: Displays the movement name and provides an "Add Set" trigger.
 * 2. **Set Mapping**: Dynamically renders a collection of `ActiveSetRow` components based on the current state.
 * 3. **Grid Alignment**: Standardizes the visual columns for Set Number, Weight (kg), Repetitions, and Completion Status.
 * * @param {Object} props - Component properties.
 * @param {ActiveExercise} props.exercise - The localized exercise object containing its unique UI ID, movement metadata, and set array.
 * @returns {JSX.Element} A themed card containing the exercise header and a reactive list of performance rows.
 */
export const ActiveExerciseCard = ({ exercise }: { exercise: ActiveExercise }) => {
	/** * Access the set addition action from the persistent Zustand store.
	 * This action appends a new set object with default values to the current exercise.
	 */
	const addSet = useActiveWorkoutStore((state) => state.addSet);

	return (
		<div className="bg-secondary/5 border border-primary/10 rounded-2xl overflow-hidden">
			<div className="p-4 bg-secondary/10 border-b border-primary/5 flex justify-between items-center">
				<h3 className="font-black uppercase italic text-sm tracking-tight">{exercise.name}</h3>
				<Button variant="ghost" size="sm" onClick={() => addSet(exercise.id)} className="h-7 text-[10px] uppercase font-bold text-primary">
					<Plus size={14} className="mr-1" /> Add Set
				</Button>
			</div>

			{/* Set List Container */}
			<div className="p-2 space-y-1">
				<div className="grid grid-cols-[30px_1fr_1fr_45px] gap-2 px-2 mb-1 text-[8px] uppercase font-black text-muted-foreground tracking-widest">
					<span>Set</span>
					<span className="text-center">KG</span>
					<span className="text-center">Reps</span>
					<span className="text-right">Done</span>
				</div>

				{/** * Set Iteration:
				 * Maps through the exercise's sets to render interactive rows.
				 * Uses the set's unique UI ID as a key for stable reconciliation.
				 */}
				{exercise.sets.map((set, index) => (
					<ActiveSetRow key={set.id} index={index} set={set} exerciseId={exercise.id} />
				))}
			</div>
		</div>
	);
};
