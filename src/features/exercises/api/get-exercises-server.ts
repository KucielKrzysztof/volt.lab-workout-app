import { createClient } from "@/core/supabase/server";
import { exerciseService } from "@/services/apiExercises";

export async function getExercisesServer() {
    const supabase = await createClient();
    return exerciseService.getAllExercises(supabase);
}