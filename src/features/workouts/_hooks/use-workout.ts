import { useQuery } from "@tanstack/react-query";
import { workoutService } from "@/services/apiWorkouts";
import { createClient } from "@/core/supabase/client";
import { Workout } from "@/types/workouts";

export const useWorkout = (id: string, initialData?: Workout) => {
	return useQuery({
		queryKey: ["workout", id],
		queryFn: async () => {
			const { data, error } = await workoutService.getWorkoutById(createClient(), id);
			if (error) throw error;
			if (!data) throw new Error("Workout not found");
			return data as unknown as Workout;
		},
		initialData,
		staleTime: 1000 * 60 * 60,
	});
};
