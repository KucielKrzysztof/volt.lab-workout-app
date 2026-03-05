/**
 * @fileoverview Specialized dialog component for workout session decommissioning.
 * Orchestrates the destructive lifecycle of training records with integrated
 * safety guards and high-contrast feedback.
 * @module features/workouts/components
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

/**
 * Properties for the DeleteWorkoutDialog component.
 * @interface DeleteWorkoutDialogProps
 * @property {string} workoutId - The unique identifier (UUID) of the target workout.
 * @property {string} workoutName - The human-readable name of the session for confirmation context.
 * @property {function} onDelete - Callback function to trigger the deletion mutation.
 */
interface DeleteWorkoutDialogProps {
	workoutId: string;
	workoutName: string;
	onDelete: (id: string) => void;
}

/**
 * DeleteWorkoutDialog Component.
 * * @description
 * An atomic confirmation modal.
 * **Contextual Verification**: Explicitly injects the `workoutName` into
 * the description to ensure the user is purging the correct workout.
 * * @param {DeleteWorkoutDialogProps} props - Component properties.
 * @returns {JSX.Element} A secure, themed dialog for record destruction.
 */
export const DeleteWorkoutDialog = ({ workoutId, workoutName, onDelete }: DeleteWorkoutDialogProps) => {
	return (
		/* Root container ensures clicks on the dialog portal don't reach parent card logic. */
		<div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => e.stopPropagation()}
						className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
					>
						<Trash2 size={14} />
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent className="bg-background border-primary/20 max-w-[90vw] rounded-2xl" onClick={(e) => e.stopPropagation()}>
					<AlertDialogHeader>
						<div className="flex items-center gap-2 text-primary mb-2">
							<Trash2 size={24} className="animate-pulse text-destructive" />
							<AlertDialogTitle className="uppercase font-black italic tracking-tighter text-xl">
								<span className="text-destructive">DELETE</span> WORKOUT?
							</AlertDialogTitle>
						</div>
						<AlertDialogDescription className="text-xs font-bold uppercase tracking-tight opacity-70">
							This will permanently delete the record of <span className="text-destructive"> {workoutName} </span>
							and all associated sets from your history.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-white/5 hover:bg-white/10 uppercase font-semibold! tracking-tighter">
							Abort
						</AlertDialogCancel>

						<AlertDialogAction
							onClick={() => onDelete(workoutId)}
							className="bg-destructive! text-destructive-foreground!hover:opacity-90 uppercase font-semibold! italic tracking-tighter shadow-[0_0_15px_rgba(var(--color-destructive),0.4)]!"
						>
							Confirm Decommission
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
