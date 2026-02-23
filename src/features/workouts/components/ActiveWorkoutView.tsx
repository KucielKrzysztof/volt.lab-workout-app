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

export const ActiveWorkoutView = () => {
	const router = useRouter();
	const { exercises } = useActiveWorkoutStore();
	const { mutate: finish, isPending } = useFinishWorkout();

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
			<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{exercises.map((ex) => (
					<ActiveExerciseCard key={ex.id} exercise={ex} />
				))}
			</div>

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

					<AlertDialogContent className="bg-zinc-950 border-primary/20 max-w-[90vw] rounded-2xl">
						<AlertDialogHeader>
							<div className="flex items-center gap-2 text-primary mb-2">
								<Trophy size={24} className="animate-bounce" />
								<AlertDialogTitle className="uppercase font-black italic tracking-tighter text-2xl">Finish & Save?</AlertDialogTitle>
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
