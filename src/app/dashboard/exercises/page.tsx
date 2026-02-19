import { ExercisesClientView } from "./components/ExercisesClientView";
import { getExercisesServer } from "@/features/exercises/api/get-exercises-server";

export default async function ExercisesPage() {
	const exercises = await getExercisesServer();

	return (
		<div className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
			<h1 className="text-2xl font-black italic uppercase">Exercise list</h1>

			<ExercisesClientView initialExercises={exercises || []} />
		</div>
	);
}
