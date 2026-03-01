/**
 * @fileoverview Vertical feed component for chronological workout history.
 * Manages the iterative rendering of workout summaries and provides
 * architectural hooks for infinite pagination and empty-state handling.
 * @module features/workouts/components
 */

import { SummaryWorkoutCard } from "./SummaryWorkoutCard";
import { WorkoutUI } from "../../../types/workouts";

interface WorkoutHistoryProps {
	/** An array of mapped workout data objects formatted for the UI. */
	workouts: WorkoutUI[];
}

/**
 * Vertical list component for the user's workout history.
 * * * @description
 * Groups multiple SummaryWorkoutCards and provides a placeholder for pagination.
 * * This component is designed to be highly reusable across the Feed and History views
 * * @param {WorkoutHistoryProps} props - Component properties.
 * @returns {JSX.Element} A structured section containing the workout feed or a fallback message.
 */
export const WorkoutHistory = ({ workouts }: WorkoutHistoryProps) => {
	/** * Conditional Empty State:
	 * Prevents rendering the section structure if no data is available,
	 * which is common for new users or fresh accounts
	 */
	if (workouts.length === 0) {
		return <p className="text-muted-foreground italic">No recent workouts yet!</p>;
	}
	return (
		<section className="space-y-6 w-full">
			<div className="flex items-start flex-col">
				<h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">Workout history</h2>
				<p className="text-[10px] opacity-40 uppercase font-mono">Total: {workouts.length}</p>
			</div>

			{/* Iterative list of workout summaries */}
			<div className="flex flex-col gap-2">
				{workouts.map((workout) => (
					<SummaryWorkoutCard key={workout.id} workout={workout} />
				))}
			</div>

			{/* Pagination Trigger: #TODO
                This placeholder will eventually be replaced with an Intersection Observer 
                to trigger infinite loading via TanStack Query / or simple pagination...
            */}
			<div className="w-full  text-center text-muted-foreground hover:text-primary uppercase text-[10px] tracking-widest font-bold py-8">
				Loading Older Sessions...
			</div>
		</section>
	);
};
