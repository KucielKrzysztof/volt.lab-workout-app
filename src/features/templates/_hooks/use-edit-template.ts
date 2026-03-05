/**
 * @fileoverview Mutation hook for workout blueprint recalibration.
 * Orchestrates the update lifecycle for existing training templates, ensuring
 * database integrity and client-side cache synchronization.
 * @module features/templates/hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { templateService } from "@/services/apiTemplates";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/core/supabase/client";
import { CreateTemplateInput } from "@/types/templates";

/**
 * Custom hook for editing workout templates via TanStack Query mutations.
 * * @description
 * This hook manages the asynchronous state of updating a workout routine. It
 * leverages the `templateService.updateTemplate` logic, which implements
 * a "Delete-and-Insert" relational strategy for exercise line items.
 * * **Core Responsibilities:**
 * 1. **Relational Persistence**: Triggers a multi-stage transaction to update
 * the routine header and synchronize nested exercises.
 * 2. **Cache Invalidation**: Strategically invalidates the `["templates"]`
 * query key to force a background refetch of the routine library.
 * 3. **UI Orchestration**: Handles success/error feedback via the `sonner`
 * toast system and manages post-mutation redirection.
 * * @param {string} templateId - The unique UUID of the template to be modified.
 * @returns {UseMutationResult} A mutation object containing the `mutate`
 * function and its associated pending/error states.
 */
export const useEditTemplate = (templateId: string) => {
	/** * Initialize Supabase client for client-side transaction context. */
	const supabase = createClient();

	/** * Access QueryClient for granular cache management. */
	const queryClient = useQueryClient();

	/** * Router instance for redirecting user post-calibration. */
	const router = useRouter();

	return useMutation({
		/**
		 * Persistence Execution:
		 * Maps the validated input to the relational update service.
		 */
		mutationFn: (updates: CreateTemplateInput) => templateService.updateTemplate(supabase, templateId, updates),

		/**
		 * Post-Mutation Success Handler:
		 * Orchestrates cache clearing and provides visual feedback.
		 */
		onSuccess: () => {
			// Invalidate full library to ensure data parity across the Dashboard.
			queryClient.invalidateQueries({ queryKey: ["templates"] });

			// Invalidate the specific record if a detailed view exists.
			queryClient.invalidateQueries({ queryKey: ["template", templateId] });

			toast.success("Blueprint edited successfully.");

			// Transition user back to the main management hub.
			router.push("/dashboard/templates");
		},

		/**
		 * Error Interception:
		 * Displays a themed error notification with diagnostic details.
		 */
		onError: (err) => toast.error(`Calibration failed: ${err.message}`),
	});
};
