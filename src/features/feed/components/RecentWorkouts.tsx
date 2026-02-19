import { Button } from "@/components/ui/button";
import { SummaryWorkoutCard } from "@/features/workouts/components/SummaryWorkoutCard";
import type { Workout } from "@/types/workouts";
import { RecentWorkoutsHeader } from "./RecentWorkoutsHeader";

interface RecentWorkoutsProps {
	workouts: Workout[];
}

/**
 * Container for the workout history list.
 * Orchestrates the display of workout cards and includes a "Show More" toggle.
 */
export const RecentWorkouts = ({ workouts }: RecentWorkoutsProps) => {
	if (workouts.length === 0) {
		return <p className="text-muted-foreground italic">No recent workouts yet!</p>;
	}

	return (
		<div className="space-y-6 mt-5 w-full">
			<RecentWorkoutsHeader />

			<div className="flex flex-col">
				{workouts.map((workout) => (
					<SummaryWorkoutCard key={workout.id} {...workout} />
				))}
				<Button variant="outline" className="w-fit mx-auto">
					Show More/Less
				</Button>
			</div>
		</div>
	);
};
