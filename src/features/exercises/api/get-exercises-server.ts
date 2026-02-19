import { createClient } from "@/core/supabase/server";
import { exerciseService } from "@/services/apiExercises";

/**
 * Server-side data fetching utility for Exercises.
 * This function is designed to be used exclusively in Server Components.
 * It initializes the Server-side Supabase client (managing cookies and headers)
 * and delegates the data retrieval to the exercise service.
 * * @returns {Promise<Exercise[]>} A promise that resolves to the list of exercises.
 */
export async function getExercisesServer() {
	const supabase = await createClient();
	return exerciseService.getAllExercises(supabase);
}
