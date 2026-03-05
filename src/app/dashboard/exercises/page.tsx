import { PageHeader } from "@/components/ui/PageHeader";
import { ExercisesClientView } from "../../../features/exercises/components/ExercisesClientView";
import { getExercisesServer } from "@/features/exercises/api/get-exercises-server";

/**
 * Exercises Page (Library).
 * Uses Server-Side Rendering (SSR) to fetch the full list of exercises.
 * * Data Flow:
 * 1. Fetches data on the server via getExercisesServer.
 * 2. Passes the data to ExercisesClientView as initialExercises.
 * 3. Enables instant filtering and searching on the client side.
 */
export default async function ExercisesPage() {
	const exercises = await getExercisesServer();

	return (
		<div className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
			<PageHeader title="Exercise list" />

			<ExercisesClientView initialExercises={exercises || []} />
		</div>
	);
}
