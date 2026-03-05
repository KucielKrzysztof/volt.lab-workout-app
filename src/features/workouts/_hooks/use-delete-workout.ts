/**
 * @fileoverview Mutation hook for workout record decommissioning.
 * Encapsulates the asynchronous deletion logic and local cache synchronization.
 * @module features/workouts/hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { workoutService } from "@/services/apiWorkouts";
import { toast } from "sonner";

/**
 * Custom hook for deleting a historical workout session.
 * * @description
 * This hook orchestrates the removal of a workout from the persistent storage.
 * It leverages the 'workouts' query key for targeted cache invalidation, ensuring
 * the UI remains a faithful representation of the remote state.
 * * **Operational Architecture:**
 * 1. **Atomic Deletion**: Dispatches a delete command to the Supabase 'workouts' table.
 * 2. **Cascade Cleanup**: Relies on DB-level constraints to purge associated sets.
 * 3. **Reactive Sync**: Triggers a re-fetch of the workout history for the specific user.
 * * **Logic Flow:**
 * {Mutation Trigger (ID)} > {API Call} > {Cache Invalidation (userId)} > {Toast Feedback}
 * * @param {string} userId - The unique identifier of the user, required for scoped cache invalidation.
 * @returns {UseMutationResult} The TanStack Query mutation object containing state and dispatchers.
 */
export const useDeleteWorkout = (userId: string) => {
	/** * Database Client: Initialized for client-side operations. */
	const supabase = createClient();

	/** * Query Engine: Accessed for manual cache manipulation and re-fetching. */
	const queryClient = useQueryClient();

	return useMutation({
		/**
		 * Dispatches the delete request via the workout service.
		 * @param {string} workoutId - The UUID of the session to be purged.
		 */
		mutationFn: (workoutId: string) => workoutService.deleteWorkout(supabase, workoutId),

		/**
		 * Post-deletion synchronization logic.
		 * @description
		 * Upon a successful deletion, we invalidate the specific query key for the user.
		 * This forces TanStack Query to re-fetch the history, removing the stale entry.
		 */
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
			toast.success("Workout session deleted from archives.");
		},
		/**
		 * Exception handling for failed deletions.
		 */
		onError: (err) => {
			toast.error(`Deletion failed: ${err.message || "Unexpected error"}`);
		},
	});
};
