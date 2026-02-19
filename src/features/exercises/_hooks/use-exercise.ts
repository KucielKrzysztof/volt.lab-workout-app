import { createClient } from "@/core/supabase/client";
import { exerciseService } from "@/services/apiExercises";
import { Exercise } from "@/types/exercises";
import { useQuery } from "@tanstack/react-query";

export const EXERCISES_QUERY_KEY = ["exercises"];

/**
 * Hook for managing exercise data state using TanStack Query.
 * * It supports SSR hydration by accepting initialData. If the cache is empty,
 * it fetches fresh data using the Browser Supabase client.
 * * @param initialData - Data prefetched on the server to avoid client-side loading states.
 */
export const useExercises = (initialData?: Exercise[]) => {
	const supabase = createClient();

	return useQuery({
		queryKey: EXERCISES_QUERY_KEY,
		queryFn: () => exerciseService.getAllExercises(supabase),
		initialData: initialData,
		staleTime: 1000 * 60 * 30, // Data is considered fresh for 30 minutes
	});
};
