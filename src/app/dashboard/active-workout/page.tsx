import { ActiveWorkoutView } from "@/features/workouts/components/ActiveWorkoutView";
/**
 * Active Workout Page.
 * Acts as the dedicated workspace for the current training session.
 */
export default function ActiveWorkoutPage() {
	return (
		<div className="max-w-xl mx-auto pb-32">
			<ActiveWorkoutView />
		</div>
	);
}
