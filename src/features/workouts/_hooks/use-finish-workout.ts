/**
 * @fileoverview Mutation hook for finalizing and persisting active workout sessions.
 * Orchestrates the transition from a volatile local Zustand state to a
 * permanent relational record in Supabase.
 * @module features/workouts/hooks
 */

import { useUser } from "@/core/providers/UserProvider";
import { useActiveWorkoutStore } from "./use-active-workout-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutService } from "@/services/apiWorkouts";
import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Custom hook that provides a mutation to finish and save the current workout.
 * * @description
 * This hook is the definitive "Exit Point" of the training tracker. It performs
 * heavy client-side data aggregation before triggering a server-side transaction.
 * * **Key Responsibilities:**
 * 1. **Data Validation**: Ensures at least one set is marked as completed before saving.
 * 2. **Analytics Calculation**: Computes total duration and cumulative volume on the fly.
 * 3. **Relational Flattening**: Transforms the hierarchical Zustand store structure
 * into a flat array of sets compatible with the database schema.
 * 4. **State Cleanup**: Resets the active session store and refreshes the history cache upon success.
 * * @returns {UseMutationResult} A TanStack Query mutation object for executing the save process.
 * * @example
 * const { mutate: finish, isPending } = useFinishWorkout();
 * // Triggered by a "Finish Workout" button in the UI.
 * finish();
 */
export const useFinishWorkout = () => {
	const store = useActiveWorkoutStore();
	const { user } = useUser();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		/**
		 * Orchestrates the data aggregation and API call.
		 * @throws {Error} If the user is not authenticated or if no completed sets are found.
		 */
		mutationFn: async () => {
			if (!user) throw new Error("User not authenticated");

			// Time aggregation logic.
			const endTime = new Date();
			const startTime = new Date(store.startTime!);
			const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

			/**
			 * Flatten and Filter logic:
			 * Extracts only sets marked 'isCompleted' and injects positional ordering.
			 */
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

			// Filtering sets that actually has been done
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

		/**
		 * Post-persistence orchestration.
		 * Ensures the UI reflects the new state immediately.
		 */
		onSuccess: () => {
			// 1. Invalidate history queries to trigger a background refetch.
			queryClient.invalidateQueries({ queryKey: ["workouts"] });

			/** 2. Atomic state reset:
			 * Clears the 'volt-active-session' key from localStorage via Zustand persist.
			 */
			store.cancelWorkout();

			// 3. User feedback and navigation.
			toast.success("Workout saved! Great job today!");
			router.push("/dashboard/workouts");
		},

		/** Handles and logs transaction failures. */
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
