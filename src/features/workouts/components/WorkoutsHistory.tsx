import { SummaryWorkoutCard } from "./SummaryWorkoutCard";
import { Workout } from "../../../types/workouts";

interface WorkoutHistoryProps {
	workouts: Workout[];
}

/**
 * Vertical list component for the user's workout history.
 * Groups multiple SummaryWorkoutCards and provides a placeholder for pagination.
 */
export const WorkoutHistory = ({ workouts }: WorkoutHistoryProps) => {
	return (
		<section className="space-y-6 w-full">
			<div className="flex items-start flex-col">
				<h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">Workout history</h2>
				<p className="text-[10px] opacity-40 uppercase font-mono">Total: {workouts.length}</p>
			</div>

			<div className="flex flex-col gap-2">
				{workouts.map((workout) => (
					<SummaryWorkoutCard key={workout.id} {...workout} />
				))}
			</div>

			{/* Placeholder */}
			<div className="w-full  text-center text-muted-foreground hover:text-primary uppercase text-[10px] tracking-widest font-bold py-8">
				Loading Older Sessions...
			</div>
		</section>
	);
};
