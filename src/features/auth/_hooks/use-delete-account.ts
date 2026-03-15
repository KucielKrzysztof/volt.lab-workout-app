/**
 * @fileoverview Client-side Mutation Hook for Account Decommissioning.
 * Orchestrates the asynchronous state management and side effects for
 * the user deletion process.
 * @module features/auth/hooks/useDeleteAccount
 */

import { useMutation } from "@tanstack/react-query";
import { deleteUserAccount } from "../api/delete-account";
import { useLogout } from "./use-logout"; // Twój istniejący hook do wylogowania
import { toast } from "sonner";

/**
 * Custom hook to manage the permanent deletion of a user account.
 * * @description
 * This hook wraps the `deleteUserAccount` Server Action within a TanStack Query
 * mutation. It provides an interface for executing the deletion while
 * managing pending states, success callbacks, and error notifications.
 * * @mutation_lifecycle
 * 1. **Execution**: Calls the `deleteUserAccount` Server Action with the `userId`.
 * 2. **Success**: Triggers a global `logout()` to purge the local state
 * and redirects the user to the authentication entry point.
 * 3. **Error**: Catches server-side exceptions and dispatches a descriptive
 * error notification via the Sonner toast system.
 * * @param {string} userId - The unique UUID of the user account targeted for decommissioning.
 * @returns {UseMutationResult} A TanStack Query mutation object containing the
 * `mutate`, `isPending`, and `error` states.
 */
export const useDeleteAccount = (userId: string) => {
	/** * Global Auth Logout:
	 * Utilized to clear the local session and redirect the user post-deletion.
	 */
	const { logout } = useLogout();

	return useMutation({
		/**
		 * Triggers the administrative deletion server action.
		 */
		mutationFn: () => deleteUserAccount(userId),
		/** * Success Handler:
		 * Finalizes the decommissioning process by updating the UI and purging the session.
		 */
		onSuccess: () => {
			toast.success("Account deleted permanently");
			logout();
		},
		/** * Error Handler:
		 * Provides visual feedback in the event of a failed deletion attempt.
		 * @param {any} err - The error object returned from the Server Action.
		 */
		onError: (err: any) => {
			toast.error("Deletion failed", { description: err.message });
		},
	});
};
