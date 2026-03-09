/**
 * @fileoverview Fallback component for the active training workspace.
 * Acts as a session guard that prevents rendering the tracking interface
 * when no initiation timestamp is present in the global store.
 * @module features/workouts/components
 */

"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * ActiveWorkoutEmpty Component.
 * * @description
 * This component serves as the "Safe Landing" state for the ActiveWorkout view.
 * It is rendered exclusively when the `startTime` in `useActiveWorkoutStore`
 * is null, signaling that no training session has been initiated.
 * * **Strategic Role:**
 * 1. **Session Guarding**: Protects against scenarios where users manually navigate
 * to the active-workout route without a valid session context.
 * 2. **Navigation Recovery**: Provides a high-visibility call-to-action (CTA)
 * to redirect the Operator back to the Launchpad (Workouts/Templates page).
 * * @returns {JSX.Element} A centered fallback prompt with navigation capabilities.
 */
export const ActiveWorkoutEmpty = () => {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
			<div className="bg-secondary/20 p-6 rounded-full animate-pulse">
				<Zap size={48} className="text-primary/20" />
			</div>
			<div className="space-y-2">
				<p className="font-black uppercase italic text-2xl tracking-tighter">No Active Workout</p>
				<p className="text-xs text-muted-foreground uppercase tracking-widest">Initiate a session to begin tracking</p>
			</div>
			<Button className="font-bold uppercase italic tracking-widest px-8 py-6" onClick={() => router.push("/dashboard/workouts")}>
				Return to Workouts
			</Button>
		</div>
	);
};
