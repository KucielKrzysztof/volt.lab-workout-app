/**
 * @fileoverview Headless logic orchestrator for the global workout session monitor.
 * Handles high-frequency temporal updates (timer) and provides an interface
 * for session termination and visibility status.
 * @module features/workouts/hooks
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveWorkoutStore } from "./use-active-workout-store";
import { toast } from "sonner";

/**
 * Custom hook providing business logic and state for the active workout banner.
 * * @description
 * This hook serves as the "brain" behind the floating session banner. It decouples
 * the high-frequency rendering logic (1Hz timer updates) from the UI layer,
 * ensuring that the banner component remains a pure view.
 * * **Core Capabilities:**
 * 1. **Temporal Synchronization**: Independently calculates session duration by
 * comparing a static `startTime` with the current system time, ensuring accuracy
 * across device sleep/wake cycles.
 * 2. **Lifecycle Management**: Automatically orchestrates `setInterval`
 * registration and disposal to prevent memory leaks in a Single Page Application (SPA).
 * 3. **Hydration Protection**: Leverages the store's hydration state to prevent
 * "flickering" or incorrect UI state before `localStorage` is restored.
 * 4. **Termination Workflow**: Centralizes the destructive session-discard
 * logic, including store cleanup, navigation, and user feedback.
 * * @returns {Object} The banner controller state.
 * @returns {string} .workoutName - The display name of the current active session.
 * @returns {string} .elapsed - A human-readable timer string in `MM:SS` format.
 * @returns {boolean} .hasHydrated - Indicates if the persistent store has finished reading from disk.
 * @returns {boolean} .isVisible - Master flag determining if the banner should be rendered in the DOM.
 * @returns {Function} .handleDiscard - Initiates the guarded session cancellation process.
 */
export const useActiveWorkoutBanner = () => {
	const router = useRouter();

	/** * Reactive session metadata from the global store. */
	const startTime = useActiveWorkoutStore((state) => state.startTime);
	const workoutName = useActiveWorkoutStore((state) => state.name);
	const hasHydrated = useActiveWorkoutStore((state) => state._hasHydrated);
	const cancelWorkout = useActiveWorkoutStore((state) => state.cancelWorkout);

	/** * Local state for the formatted timer string (MM:SS). */
	const [elapsed, setElapsed] = useState("");

	/**
	 * Temporal Engine Effect.
	 * * @description
	 * Manages a dedicated side-effect for the timer. It recalculates the
	 * difference between the current date and the session start time
	 * every 1000ms.
	 * * **Precision Handling:**
	 * Performs an immediate call to `updateTimer` before starting the interval
	 * to prevent the "1-second blank state" during initial mount.
	 */
	useEffect(() => {
		if (!startTime) return;

		const updateTimer = () => {
			const start = new Date(startTime).getTime();
			const now = new Date().getTime();
			const diff = now - start;

			const mins = Math.floor(diff / 60000);
			const secs = Math.floor((diff % 60000) / 1000);

			// Format to ensure leading zero for seconds (e.g., 5:09).
			setElapsed(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);

		// Cleanup interval on unmount or session termination.
		return () => clearInterval(interval);
	}, [startTime]);

	/**
	 * Finalizes the session discard process.
	 * * @description
	 * Clears the persistent store, redirects the user to the workout history,
	 * and provides a non-intrusive error notification.
	 */
	const handleDiscard = () => {
		cancelWorkout();
		router.push("/dashboard/workouts");
		toast.error("Workout discarded.");
	};

	return {
		workoutName,
		elapsed,
		hasHydrated,
		/** * Logical Guard:
		 * The banner should only be visible if we have an active timestamp
		 * AND the application has successfully read the state from disk.
		 */
		isVisible: !!startTime && hasHydrated,
		handleDiscard,
	};
};
