import { SupabaseClient } from "@supabase/supabase-js";
import { Exercise } from "@/types/exercises";

export const exerciseService = {
	async getAllExercises(supabase: SupabaseClient): Promise<Exercise[]> {
		const { data, error } = await supabase.from("exercises").select("*").order("name", { ascending: true });

		if (error) throw new Error(error.message);
		return data || [];
	},

	// ... getById, create, etc...
};
