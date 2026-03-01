/**
 * @fileoverview Persistent session monitor UI (Presentational Layer).
 * Acts as the visual interface for the global active workout state,
 * delegating all temporal calculations and state orchestration to
 * the `useActiveWorkoutBanner` logic hook.
 * @module features/workouts/components
 */
"use client";

import Link from "next/link";
import { Activity, AlertTriangle, Timer, X } from "lucide-react";

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
import { useActiveWorkoutBanner } from "../_hooks/use-active-workout-banner";

/**
 * A floating, high-visibility banner component for active session tracking.
 * * @description
 * This component serves as a global "Sticky Anchor" across the dashboard.
 * Following its refactor, it is now a pure view component that consumes
 * computed data (timer strings, visibility flags) from a headless hook.
 * * **Visual & Interaction Features:**
 * 1. **Contextual Awareness**: Automatically renders or unmounts based on the
 * `isVisible` flag, which accounts for both session activity and store hydration.
 * 2. **Deep Linking**: Provides a seamless transition to the detailed tracking
 * workspace via an encapsulated Next.js `Link`.
 * 3. **Real-time Performance Display**: Renders the formatted `elapsed` time string
 * updated at a 1Hz frequency by the underlying logic hook.
 * 4. **Safety Discard Workflow**: Integrates a Shadcn/UI `AlertDialog` to wrap
 * the destructive `handleDiscard` action, ensuring data loss requires explicit confirmation.
 * * @returns {JSX.Element | null} The themed banner or null if no session is active.
 */
export const ActiveWorkoutBanner = () => {
	const { workoutName, elapsed, isVisible, handleDiscard } = useActiveWorkoutBanner();

	/** * Guard Clause:
	 * Centralized visibility logic handled by the hook (startTime && hasHydrated).
	 */
	if (!isVisible) return null;

	return (
		<div className="fixed top-4 md:top-16 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
			{/* Themed container with primary accent border and shadow glow. */}
			<div className="flex items-center justify-between gap-3 p-4 bg-zinc-950 border-2 border-primary rounded-2xl shadow-[0_0_20px_rgba(var(--primary),0.2)] group hover:scale-[1.02] transition-all">
				{/* Information Link: Redirects to the detailed session workspace. */}
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

				{/* Action Zone: Live timer and destructive toggle control. */}
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
									onClick={handleDiscard}
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
