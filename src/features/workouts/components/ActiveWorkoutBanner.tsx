"use client";

import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import Link from "next/link";
import { Activity, AlertTriangle, Timer, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export const ActiveWorkoutBanner = () => {
	const router = useRouter();
	const startTime = useActiveWorkoutStore((state) => state.startTime);
	const workoutName = useActiveWorkoutStore((state) => state.name);
	const hasHydrated = useActiveWorkoutStore((state) => state._hasHydrated);
	const cancelWorkout = useActiveWorkoutStore((state) => state.cancelWorkout);

	const [elapsed, setElapsed] = useState("");

	useEffect(() => {
		if (!startTime) return;
		const interval = setInterval(() => {
			const start = new Date(startTime).getTime();
			const now = new Date().getTime();
			const diff = now - start;
			const mins = Math.floor(diff / 60000);
			const secs = Math.floor((diff % 60000) / 1000);
			setElapsed(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
		}, 1000);
		return () => clearInterval(interval);
	}, [startTime]);

	const onConfirmCancel = () => {
		cancelWorkout();
		router.push("/dashboard/workouts");
		toast.error("Workout discarded.");
	};

	if (!hasHydrated || !startTime) return null;

	return (
		<div className="fixed top-4 md:top-16 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
			{/* GŁÓWNY KONTENER - to on ma styl karty */}
			<div className="flex items-center justify-between gap-3 p-4 bg-zinc-950 border-2 border-primary rounded-2xl shadow-[0_0_20px_rgba(var(--primary),0.2)] group hover:scale-[1.02] transition-all">
				{/* KLIKALNA STREFA INFO (Link) - zajmuje całą wolną przestrzeń */}
				<Link href="/dashboard/active-workout" className="flex flex-1 items-center gap-3 overflow-hidden">
					<div className="relative flex shrink-0">
						<div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
						<div className="relative bg-primary p-2 rounded-full">
							<Activity size={16} className="text-primary-foreground italic" />
						</div>
					</div>

					<div className="flex flex-col overflow-hidden">
						<span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-0.5">Active Session</span>
						<h4 className="text-sm font-black italic uppercase text-white truncate tracking-tighter">{workoutName}</h4>
					</div>
				</Link>

				{/* STREFA AKCJI - timer i przycisk cancel (osobno poza Linkiem) */}
				<div className="flex items-center gap-2 shrink-0">
					<div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
						<Timer size={14} className="text-primary" />
						<span className="text-xs font-mono font-bold text-white tracking-widest">{elapsed}</span>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<button className="p-1.5 hover:bg-destructive/20 hover:text-destructive text-white/20 rounded-md transition-colors">
								<X size={18} />
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-background border-primary/20 max-w-[90vw] rounded-2xl">
							<AlertDialogHeader>
								<div className="flex items-center gap-2 text-destructive mb-2">
									<AlertTriangle size={20} />
									<AlertDialogTitle className="uppercase font-black italic tracking-tighter text-xl">Discard Session?</AlertDialogTitle>
								</div>
								<AlertDialogDescription className="text-zinc-400 font-medium">
									This will permanently delete your current progress. Are you sure?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
								<AlertDialogCancel className="border-white/10 bg-white/5 hover:bg-white/10 uppercase font-semibold! tracking-tighter">
									Keep training
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={onConfirmCancel}
									className="bg-destructive! hover:bg-destructive/90! text-white uppercase font-semibold! italic tracking-tighter"
								>
									Discard anyway
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	);
};
