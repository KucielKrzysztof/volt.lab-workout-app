import { Button } from "@/components/ui/button";
import { SummaryWorkoutCard } from "@/features/workouts/components/SummaryWorkoutCard";
import type { Workout } from "@/features/workouts/types/workouts";

interface RecentWorkoutsProps {
	workouts: Workout[];
}

export const RecentWorkouts = ({ workouts }: RecentWorkoutsProps) => {
	if (workouts.length === 0) {
		return <p className="text-muted-foreground italic">No recent workouts yet!</p>;
	}

	return (
		<div className="space-y-6 mt-5">
			<header className="flex justify-between items-end mb-8 md:gap-2">
				<div>
					<h2 className="text-3xl font-extrabold tracking-tighter uppercase">Your Trainings</h2>
					<p className="text-muted-foreground text-sm uppercase tracking-widest">Recent activity</p>
				</div>
				<div className="text-right">
					<span className="text-2xl font-black text-primary italic uppercase">7 DAY STREAK 🔥</span>
				</div>
			</header>

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
