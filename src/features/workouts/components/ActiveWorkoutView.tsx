/**
 * @fileoverview Main View for the active training workspace.
 * Provides the interactive interface for tracking a live workout session,
 * aggregating real-time exercise cards and the finalization workflow.
 * @module features/workouts/components
 */

"use client";

import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { useFinishWorkout } from "../_hooks/use-finish-workout";
import { ActiveExerciseCard } from "./ActiveExerciseCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

/**
 * Primary view component for an ongoing workout session.
 * * @description
 * This component serves as the central "command center" during a workout. It dynamically
 * renders exercise tracking cards based on the current Zustand store state and manages
 * the high-stakes finalization process via a confirmation dialog.
 * * **Key Features:**
 * 1. **Zero-Session Handling**: Automatically detects empty states and redirects users
 * to select a routine if no session is active.
 * 2. **Real-time Card List**: Maps the active exercises into interactive `ActiveExerciseCard`
 * components for immediate data entry.
 * 3. **Guarded Finalization**: Implements an `AlertDialog` to prevent accidental
 * session completions, requiring explicit user intent to trigger the persistence mutation.
 * 4. **Mutation Integration**: Hooks into `useFinishWorkout` to handle the asynchronous
 * transition from local state to database record.
 * * @returns {JSX.Element} The rendered active workout interface or an empty-state prompt.
 */
export const ActiveWorkoutView = () => {
	const router = useRouter();

	/** * Access the reactive list of exercises from the persistent store.
	 * Changes here (e.g., adding sets) trigger immediate re-renders of the list.
	 */
	const { exercises } = useActiveWorkoutStore();

	/** * Initialize the finalization mutation.
	 * `isPending` state is used to disable the finish button and prevent duplicate submissions.
	 */
	const { mutate: finish, isPending } = useFinishWorkout();

	/** * Fallback UI for inactive states.
	 * Prevents the application from rendering a blank tracking screen if the store is empty.
	 */
	if (!exercises.length) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
				<p className="font-black uppercase italic opacity-20 text-4xl">No Active Session</p>
				<Button onClick={() => router.push("/dashboard/templates")}>Select a Template</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6 mt-30">
			{/* Live exercise tracking list.
                Utilizes Tailwind's 'animate-in' for a smooth transition when the session starts.
            */}
			<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{exercises.map((ex) => (
					<ActiveExerciseCard key={ex.id} exercise={ex} />
				))}
			</div>

			{/* Fixed-position action footer.
                Contains the primary "Finish Workout" button and its associated confirmation logic.
            */}
			<div className="fixed bottom-20 left-4 right-4 max-w-xl mx-auto">
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
								onClick={() => finish()}
								className="bg-success! text-success-foreground hover:opacity-90 uppercase font-semibold! italic tracking-tighter shadow-[0_0_15px_rgba(var(--color-success),0.4)]"
							>
								FINISH!
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
};
