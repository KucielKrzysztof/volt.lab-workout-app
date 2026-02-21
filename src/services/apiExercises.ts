import { SupabaseClient } from "@supabase/supabase-js";
import { Exercise } from "@/types/exercises";

/**
 * Service responsible for exercise-related database operations.
 * * Uses an agnostic SupabaseClient to allow execution in both
 * Server Components (Node.js) and Client Components (Browser).
 */
export const exerciseService = {
	/**
	 * Fetches all exercises from the database ordered by name.
	 * @param supabase - An instance of the Supabase client (Server or Browser).
	 * @throws {Error} If the database query fails.
	 */

	async getAllExercises(supabase: SupabaseClient): Promise<Exercise[]> {
		const { data, error } = await supabase.from("exercises").select("*").order("name", { ascending: true });

		if (error) {
			console.error("Supabase Error:", error.message);
			throw new Error(error.message);
		}
		return data || [];
	},

	// ... getById, create, etc...
};
