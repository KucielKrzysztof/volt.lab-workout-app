/**
 * @fileoverview Mutation hook for workout blueprint decommissioning.
 * Orchestrates the secure removal of training routines from the user's library
 * and triggers automated cache cleanup.
 * @module features/templates/hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templateService } from "@/services/apiTemplates";
import { toast } from "sonner";
import { createClient } from "@/core/supabase/client";

/**
 * Custom hook for deleting workout templates via TanStack Query mutations.
 * * @description
 * This hook manages the destruction lifecycle of a workout routine. It leverages
 * the **Atomic Deletion Strategy**, relying on PostgreSQL's `ON DELETE CASCADE`
 * to maintain referential integrity across related exercises.
 * * **Technical Highlights:**
 * 1. **Scoped Cache Invalidation**: Specifically targets the `["templates", userId]`
 * query key to ensure the UI instantly reflects the removal without full page reloads.
 * 2. **Transactional Feedback**: Integrates with the `sonner` system to provide
 * definitive visual confirmation of the archive process.
 * 3. **Resource Guarding**: Requires a `userId` to maintain strict data scoping
 * during cache operations.
 * * @param {string} userId - The current user's UUID, required for precise cache targeting.
 * @returns {UseMutationResult} A mutation object containing the `mutate`
 * function and its execution state (pending, error, success).
 */
export const useDeleteTemplate = (userId: string) => {
	/** * Initialize client-side Supabase instance for the deletion request. */
	const supabase = createClient();

	/** * Access the global QueryClient to orchestrate state synchronization. */
	const queryClient = useQueryClient();

	return useMutation({
		/**
		 * Core Deletion Logic:
		 * Executes the removal via the template service. The verified PostgreSQL
		 * cascade handles child 'template_exercises' automatically.
		 */
		mutationFn: (templateId: string) => templateService.deleteTemplate(supabase, templateId),

		/**
		 * Post-Deletion Orchestration:
		 * Synchronizes the client-side library state with the updated database state.
		 */
		onSuccess: () => {
			/** * Selective Invalidation:
			 * Forces the templates library to refetch, ensuring the removed
			 * blueprint disappears from the Dashboard view immediately.
			 */
			queryClient.invalidateQueries({ queryKey: ["templates", userId] });

			toast.success("Blueprint archived and removed.");
		},

		/**
		 * Error Interception:
		 * Dispatches a themed notification if the deletion transaction is interrupted.
		 */
		onError: (err) => toast.error(`Deletion failed: ${err.message}`),
	});
};
