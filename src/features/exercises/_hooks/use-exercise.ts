import { createClient } from "@/core/supabase/client";
import { exerciseService } from "@/services/apiExercises";
import { Exercise } from "@/types/exercises";
import { useQuery } from "@tanstack/react-query";

export const EXERCISES_QUERY_KEY = ["exercises"];

export const useExercises = (initialData?: Exercise[]) => {
	const supabase = createClient();

	return useQuery({
		queryKey: EXERCISES_QUERY_KEY,
		queryFn: () => exerciseService.getAllExercises(supabase),
		initialData: initialData,
		staleTime: 1000 * 60 * 5,
	});
};
