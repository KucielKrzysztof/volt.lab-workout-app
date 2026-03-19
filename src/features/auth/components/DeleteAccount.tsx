/**
 * @fileoverview Destructive Account Management Component.
 * Provides the user interface for permanent account decommissioning within the settings domain.
 * @module features/auth/components/DeleteAccountSection
 */

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteAccount } from "../_hooks/use-delete-account";
import { Button } from "@/components/ui/button";

/**
 * @interface DeleteAccountSectionProps
 * @description Contract for the account deletion interface.
 * @property {string} userId - Unique UUID of the user targeted for account removal.
 */
interface DeleteAccountSectionProps {
	userId: string;
}

/**
 * DeleteAccountSection Component.
 * * @description
 * Renders a "Danger Zone" UI block designed for permanent account termination.
 * It encapsulates a destructive mutation within a Shadcn-based confirmation dialog
 * (AlertDialog) to ensure high-stakes operations are intentional and verified.
 * * **UX Strategy:**
 * 1. **Visual Cues**: Utilizes the 'destructive' color palette and high-contrast
 * headers to signal irreversible intent.
 * 2. **Verification Gate**: Enforces a modal-based confirmation to prevent
 * accidental account decommissioning.
 * 3. **State Feedback**: Displays a localized loader during the asynchronous
 * deletion mutation.
 * * @param {DeleteAccountSectionProps} props - Component properties.
 * @returns {JSX.Element} The rendered decommissioning interface.
 */
export const DeleteAccountSection = ({ userId }: DeleteAccountSectionProps) => {
	/** * Mutation Hook:
	 * Orchestrates the server-side deletion process and handles post-deletion side effects.
	 */
	const { mutate: deleteAccount, isPending } = useDeleteAccount(userId);

	return (
		<div className="p-4 border border-red-500/20 bg-red-500/5 rounded-2xl text-center">
			{/* Warning Header */}
			<h3 className="text-destructive font-bold uppercase italic ">Danger Zone</h3>
			<p className="text-xs text-muted-foreground mt-1">Once you delete your account, there is no going back. Please be certain.</p>

			{/* Confirmation Gateway */}
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive" size="sm" className="mt-4 font-black italic uppercase">
						Terminate Account
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						{/* Final Destructive Action Trigger */}
						<AlertDialogAction asChild>
							<Button
								variant="destructive"
								onClick={(e) => {
									deleteAccount();
								}}
								disabled={isPending}
								className="uppercase font-black italic shadow-lg bg-destructive hover:bg-destructive/20 text-pr"
							>
								{isPending ? (
									<span className="flex items-center gap-2">
										<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Processing...
									</span>
								) : (
									"Yes, delete my account"
								)}
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
