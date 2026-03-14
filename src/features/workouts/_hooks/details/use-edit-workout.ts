/**
 * @fileoverview Headless mutation logic for workout record synchronization.
 * Orchestrates the transition from local draft states to persistent historical records.
 * @module features/workouts/hooks/details/useEditWorkout
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutService } from "@/services/apiWorkouts";
import { createClient } from "@/core/supabase/client";
import { toast } from "sonner";
import { WorkoutSet } from "@/types/workouts";

/**
 * @interface EditWorkoutPayload
 * @description Encapsulates the sanitized data required for a workout recalibration.
 * @property {number} volume - The newly calculated cumulative tonnage (weight * reps) for the session.
 * @property {WorkoutSet[]} sets - An array of performance sets containing updated weight, repetitions, and order.
 */
interface EditWorkoutPayload {
	volume: number;
	sets: WorkoutSet[];
}

/**
 * useEditWorkout Hook.
 * * @description
 * A specialized headless hook that manages the lifecycle of a workout update mutation.
 * It interfaces with the `workoutService` to persist changes and coordinates
 * global state synchronization via TanStack Query cache invalidation.
 * * @operational_flow
 * 1. **Data Transmission**: Sends the sanitized volume and set data to the Supabase backend.
 * 2. **Cache Invalidation**: On success, triggers a targeted refresh for:
 * - The specific workout detail query: `["workout", workoutId]`
 * - The global workout history feed: `["workouts"]`
 * 3. **Feedback Loop**: Dispatches high-fidelity toast notifications to inform the user of the protocol status.
 * * @param {string} workoutId - The unique UUID identifier of the workout session to be modified.
 * @returns {UseMutationResult} A TanStack Query mutation object providing execution methods and reactive states (isPending, error).
 * * @example
 * const { mutate: saveChanges, isPending } = useEditWorkout(workoutId);
 * * const handleSave = () => {
 * saveChanges({ volume: 1500, sets: updatedSets });
 * };
 */
export const useEditWorkout = (workoutId: string) => {
	const supabase = createClient();
	const queryClient = useQueryClient();

	return useMutation({
		/**
		 * Primary mutation function.
		 * Executes the two-phase update strategy defined in the workout service.
		 */
		mutationFn: async ({ volume, sets }: EditWorkoutPayload) => {
			return workoutService.updateWorkout(supabase, workoutId, volume, sets);
		},

		/**
		 * Post-mutation success protocol.
		 * Ensures that the UI displays the most recent data strings from the laboratory.
		 */
		onSuccess: () => {
			// Invalidate specific workout and the general feed to trigger a UI-wide sync
			queryClient.invalidateQueries({ queryKey: ["workout", workoutId] });
			queryClient.invalidateQueries({ queryKey: ["workouts"] });
			toast.success("Protocol Updated", {
				description: "The historical record has been recalibrated.",
			});
		},

		/**
		 * Error handling protocol.
		 * Provides technical context for failed synchronization attempts.
		 */
		onError: (err) => {
			toast.error("Calibration Failed", { description: err.message });
		},
	});
};
