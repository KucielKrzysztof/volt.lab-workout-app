/**
 * @fileoverview Mutation hook for workout template (routine) creation.
 * Orchestrates the persistent storage of new training blueprints using
 * TanStack Query and the template service layer in the VOLT.LAB ecosystem.
 * @module features/templates/hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { templateService } from "@/services/apiTemplates";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateTemplateInput } from "@/types/templates";

/**
 * Custom hook providing a mutation for creating new workout templates.
 * * @description
 * This hook serves as the transactional bridge for the routine builder UI.
 * It manages the asynchronous state of template creation, ensuring that
 * the user's routine library is atomically updated and synchronized
 * with the remote database.
 * * **Key Operational Responsibilities:**
 * 1. **Persistence**: Delegates the multi-stage database transaction (header + lines) to `templateService.createTemplate`.
 * 2. **Cache Invalidation**: Triggers a targeted refresh of the `["templates", userId]` query key to ensure the routine list is immediately updated without a page reload.
 * 3. **Navigation Control**: Automatically redirects the user to the main workouts dashboard upon successful creation to streamline the "Plan-to-Action" workflow.
 * 4. **Reactive Feedback**: Utilizes `sonner` to provide real-time, theme-consistent notifications for both successful operations and unexpected failures.
 * * @param {string} userId - The unique UUID of the user, critical for scoping cache invalidation.
 * @returns {UseMutationResult} A TanStack Query mutation object containing the `mutate` function, pending status, and error states.
 * * @example
 * const { mutate: createRoutine, isPending } = useCreateTemplate(user.id);
 * * const handleSave = () => {
 * createRoutine({
 * name: "Push Day Alpha",
 * exercises: [{ exercise_id: '...', suggested_sets: 3, suggested_reps: 10 }]
 * });
 * };
 */
export const useCreateTemplate = (userId: string) => {
	/** * Initialize client-side infrastructure.
	 * `createClient` ensures the mutation is executed within the context of the user's active session.
	 */
	const supabase = createClient();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		/**
		 * The core asynchronous execution unit.
		 * @param {CreateTemplateInput} input - The validated data structure for the new routine.
		 */
		mutationFn: async (input: CreateTemplateInput) => {
			return templateService.createTemplate(supabase, userId, input.name, input.exercises);
		},

		/**
		 * Success Orchestration Logic:
		 * Executed only after the database confirms the transaction is committed.
		 */
		onSuccess: () => {
			// Invalidate specific cache to trigger background refetching.
			queryClient.invalidateQueries({ queryKey: ["templates", userId] });

			// User feedback.
			toast.success("Routine created! 🦾");

			// Navigation to the primary workout dashboard.
			router.push("/dashboard/workouts");
		},

		/**
		 * Error Handling and Feedback:
		 * Captures database constraints, network issues, or authentication errors.
		 */
		onError: (error: unknown) => {
			let message = "An unexpected error occurred";

			// Type-safe error message extraction.
			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === "string") {
				message = error;
			}

			console.error("❌ useCreateTemplate Error:", message);
			toast.error(`Failed to create template: ${message}`);
		},
	});
};
