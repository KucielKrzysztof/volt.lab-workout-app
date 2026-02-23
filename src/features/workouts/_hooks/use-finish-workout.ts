import { useUser } from "@/core/providers/UserProvider";
import { useActiveWorkoutStore } from "./use-active-workout-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutService } from "@/services/apiWorkouts";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useFinishWorkout = () => {
	const store = useActiveWorkoutStore();
	const { user } = useUser();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("User not authenticated");

			const endTime = new Date();
			const startTime = new Date(store.startTime!);
			const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

			const completedSets = store.exercises.flatMap((ex) =>
				ex.sets
					.filter((s) => s.isCompleted)
					.map((s, idx) => ({
						exercise_id: ex.exercise_id,
						weight: s.weight,
						reps: s.reps,
						set_order: idx,
					})),
			);

			if (completedSets.length === 0) {
				throw new Error("No completed sets to save!");
			}

			// Filtrujemy tylko serie, które faktycznie zostały zrobione
			return workoutService.finishWorkout(
				createClient(),
				user.id!,
				{
					name: store.name,
					start_time: store.startTime!,
					completed_at: endTime.toISOString(),
					duration_seconds: duration,
					total_volume: completedSets.reduce((acc, s) => acc + s.weight * s.reps, 0),
				},
				completedSets,
			);
		},
		onSuccess: () => {
			// 1. Informujemy Query Client, że historia treningów jest już nieaktualna
			queryClient.invalidateQueries({ queryKey: ["workouts"] });

			// 2. Czyścimy Zustand Store (banner zniknie, blokady puszczą)
			store.cancelWorkout();

			// 3. Sukces! Przekierowujemy
			toast.success("Workout saved! Great job today!");
			router.push("/dashboard/workouts");
		},
		onError: (error: unknown) => {
			let message = "Save Error";

			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === "string") {
				message = error;
			}

			console.error("Save error:", message);

			toast.error(message || "Failed to save workout. Try again!");
		},
	});
};
