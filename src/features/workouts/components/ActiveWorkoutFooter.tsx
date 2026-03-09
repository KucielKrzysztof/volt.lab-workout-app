/**
 * @fileoverview Command & Control footer for the active training workspace.
 * Provides a persistent interface for session expansion and guarded finalization.
 * @module features/workouts/components
 */

import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
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
import { ExerciseSelector } from "@/features/templates/components/ExerciseSelector";

interface Props {
	/** Callback to inject a new exercise into the active store. */
	onAddExercise: (ex: { id: string; name: string }) => void;
	/** Execution trigger for the workout finalization mutation. */
	onFinish: () => void;
	/** Loading state from the finish mutation to prevent duplicate submissions. */
	isPending: boolean;
}

/**
 * ActiveWorkoutFooter Component.
 * * @description
 * Acts as the "Control Hub" of the live workout. It is fixed to the bottom of the
 * viewport to ensure immediate access to primary actions regardless of list length.
 * * **Core Functionalities:**
 * 1. **Dynamic Injection**: Houses the `ExerciseSelector` with a customized large trigger,
 * enabling the "On-The-Fly" expansion of both empty and templated sessions.
 * 2. **Guarded Finalization**: Wraps the "Finish" action in a high-stakes `AlertDialog`
 * to prevent accidental session termination during high-intensity training.
 * * @param {Props} props - Component properties for action handling and state monitoring.
 * @returns {JSX.Element} A fixed-position action bar for the active training session.
 */
export const ActiveWorkoutFooter = ({ onAddExercise, onFinish, isPending }: Props) => {
	return (
		<div className="fixed bottom-20 left-4 right-4 max-w-xl mx-auto space-y-1">
			<ExerciseSelector
				onSelect={onAddExercise}
				className="h-16 px-8 text-sm gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 w-full"
			/>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						disabled={isPending}
						className="w-full py-8 bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
					>
						{isPending ? "Saving..." : "Finish Workout"}
					</Button>
				</AlertDialogTrigger>

				<AlertDialogContent className="bg-background border-primary/20 max-w-[90vw] rounded-2xl">
					<AlertDialogHeader>
						<div className="flex items-center gap-2 text-primary mb-2">
							<Trophy size={24} className="animate-bounce" />
							<AlertDialogTitle className="uppercase font-black italic tracking-tighter text-xl">Finish & Save?</AlertDialogTitle>
						</div>
						<AlertDialogDescription className="text-zinc-400 font-medium">
							Great work! Once saved, this session will be added to your history. Make sure all your sets are marked as completed.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
						<AlertDialogCancel className="border-white/10 bg-white/5 hover:bg-white/10 uppercase font-semibold! tracking-tighter">
							Not yet
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => onFinish()}
							className="bg-success! text-success-foreground hover:opacity-90 uppercase font-semibold! italic tracking-tighter shadow-[0_0_15px_rgba(var(--color-success),0.4)]"
						>
							FINISH!
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
