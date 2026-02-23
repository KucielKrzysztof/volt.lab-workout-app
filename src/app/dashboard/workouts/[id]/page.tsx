import { getWorkoutServer } from "@/features/workouts/api/get-workout-server";
import { WorkoutDetailView } from "@/features/workouts/components/WorkoutDetailView";

type WorkoutPageProps = {
	params: Promise<{ id: string }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
	const resolvedParams = await params;
	const { id } = resolvedParams;

	const workout = await getWorkoutServer(id);
	return <WorkoutDetailView id={id} initialData={workout} />;
}
