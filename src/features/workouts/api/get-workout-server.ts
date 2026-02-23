import { createClient } from "@/core/supabase/server";
import { workoutService } from "@/services/apiWorkouts";

export async function getWorkoutServer(id: string) {
	const supabase = await createClient();
	const { data } = await workoutService.getWorkoutById(supabase, id);
	return data;
}
