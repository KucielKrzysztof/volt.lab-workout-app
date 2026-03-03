import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { workoutService } from "@/services/apiWorkouts";

/**
 * Dedicated hook for fetching a user's activity heatmap data.
 */
export const useYearlyActivity = (userId: string, year: number) => {
	const supabase = createClient();

	return useQuery({
		queryKey: ["workout-activity", userId, year],
		queryFn: () => workoutService.getYearlyActivitySnapshot(supabase, userId, year),
		staleTime: 1000 * 60 * 60, // Snapshot is valid for 1h.
	});
};
