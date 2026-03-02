/**
 * @fileoverview Workout Feed Presentational Layer.
 * Provides a specialized container for the iterative rendering of workout
 * summary cards. This component is strictly decoupled from data acquisition logic.
 * @module features/workouts/components
 */

import { SummaryWorkoutCard } from "./SummaryWorkoutCard";
import { WorkoutUI } from "../../../types/workouts";

/**
 * Interface for the WorkoutList component.
 * @interface WorkoutListProps
 * @property {WorkoutUI[]} workouts - A pre-flattened array of workout DTOs
 * (Data Transfer Objects) ready for immediate rendering.
 */
interface WorkoutListProps {
	workouts: WorkoutUI[];
}

/**
 * A pure presentational component that renders a vertical stream of workout summaries.
 * * @param {WorkoutListProps} props - Component properties.
 * @returns {JSX.Element} A structured vertical stack of workout summaries.
 */
export const WorkoutList = ({ workouts }: WorkoutListProps) => {
	return (
		<div className="flex flex-col gap-2 w-full">
			{workouts.map((workout) => (
				/** * Atomic Rendering:
				 * Each card is passed a pre-calculated `WorkoutUI` object.
				 * The key is bound to the database UUID for optimal diffing.
				 */
				<SummaryWorkoutCard key={workout.id} workout={workout} />
			))}
		</div>
	);
};
