/**
 * @fileoverview Main View Orchestrator for the active training workspace.
 * Refactored to act as a high-level container that manages the Hybrid Session Engine
 * logic and coordinates specialized sub-components.
 * @module features/workouts/components
 */

"use client";

import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { useFinishWorkout } from "../_hooks/use-finish-workout";
import { ActiveWorkoutEmpty } from "./ActiveWorkoutEmpty";
import { ActiveWorkoutExerciseList } from "./ActiveWorkoutExerciseList";
import { ActiveWorkoutFooter } from "./ActiveWorkoutFooter";

/**
 * Primary orchestrator component for an ongoing workout session.
 * * @description
 * Following the Atomic Refactor, this component serves as a clean "shell".
 * It synchronizes the persistent Zustand state with asynchronous mutations while
 * delegating visual concerns to specialized child units.
 * * **Architectural Responsibilities:**
 * 1. **Session Gatekeeping**: Utilizes `ActiveWorkoutEmpty` to handle scenarios where
 * no session is active (startTime is null).
 * 2. **Data Streaming**: Connects the reactive `exercises` array to the `ActiveWorkoutExerciseList`.
 * 3. **Hybrid Interaction**: Bridges the `addExercise` action and `finish` mutation
 * into the `ActiveWorkoutFooter` to support on-the-fly session expansion.
 * 4. **State Persistence**: Leverages the `useActiveWorkoutStore` to ensure training
 * data survives browser refreshes.
 * * @returns {JSX.Element} The orchestrated training workspace or the empty-state guard.
 */
export const ActiveWorkoutView = () => {
	/** * Reactive session state.
	 * Captures the definitive 'startTime' and the hierarchical 'exercises' tree.
	 */
	const { exercises, startTime, addExercise } = useActiveWorkoutStore();

	/** * Finalization pipeline.
	 * Manages the asynchronous transition from local memory to Supabase persistence.
	 */
	const { mutate: finish, isPending } = useFinishWorkout();

	/** * AUTH GUARD / SESSION CHECK
	 * If startTime is null, no session has been initiated at all.
	 */
	if (!startTime) {
		return <ActiveWorkoutEmpty />;
	}

	return (
		<div className="space-y-6 mt-30 pb-40">
			{/* LIST LAYER:
                Handles the iterative rendering of exercise cards or the "No Exercises" 
                ghost state if the session started from nothing.
            */}
			<ActiveWorkoutExerciseList exercises={exercises} />

			{/* CONTROL LAYER:
                Fixed-position interface providing global actions for session expansion 
                and atomic finalization.
            */}
			<ActiveWorkoutFooter onAddExercise={addExercise} onFinish={finish} isPending={isPending} />
		</div>
	);
};
