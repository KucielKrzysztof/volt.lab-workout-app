/**
 * @fileoverview Logic Orchestrator for the Workout Editing Lifecycle.
 * Encapsulates draft state management, real-time volume recalibration,
 * and synchronization triggers for historical records.
 * @module features/workouts/hooks/details/useWorkoutEditFlow
 */

import { useState, useMemo, useCallback } from "react";
import { Workout, WorkoutSet } from "@/types/workouts";
import { useEditWorkout } from "./use-edit-workout";

/**
 * useWorkoutEditFlow Hook.
 * * @description
 * This headless hook manages the 'Recalibration Sandbox' for a workout session.
 * It allows for non-destructive modification of training data strings by
 * maintaining a local draft state until the protocol is committed to the database.
 * * **Key Features:**
 * 1. **Deep State Synthesis**: Creates a decoupled clone of the original sets to prevent direct cache mutation.
 * 2. **Reactive Projection**: Provides real-time calculations of cumulative volume as the draft changes.
 * 3. **Action Suite**: Exposes standardized methods for entering, updating, and finalizing the edit flow.
 * * @param {Workout | undefined} workout - The source workout entity to be recalibrated.
 * @returns {Object}
 * - `isEditing`: Boolean flag for the UI mode.
 * - `draftSets`: The current mutable state of the workout performance data.
 * - `isSaving`: Pending state of the persistence mutation.
 * - `currentVolume`: Dynamically projected total volume ($V = \sum weight \times reps$).
 * - `actions`: Method suite for state manipulation (start, cancel, update, handleSave).
 */
export const useWorkoutEditFlow = (workout: Workout | undefined) => {
	/** * Persistence Engine:
	 * Handles the atomic update to the Supabase backend.
	 */
	const { mutate: saveChanges, isPending: isSaving } = useEditWorkout(workout?.id ?? "");

	/** * Internal State Hub:
	 * Manages the transition between read-only and edit-active modes.
	 */
	const [isEditing, setIsEditing] = useState(false);
	const [draftSets, setDraftSets] = useState<WorkoutSet[]>([]);

	/**
	 * Protocol Initialization.
	 * Performs a deep clone of the historical performance record to
	 * initialize the recalibration sandbox.
	 */
	const startEditing = useCallback(() => {
		if (!workout) return;
		setDraftSets(JSON.parse(JSON.stringify(workout.workout_sets)));
		setIsEditing(true);
	}, [workout]);

	/**
	 * Session Restoration.
	 * Purges the draft state and reverts the UI to standard analytical mode.
	 */
	const cancelEditing = useCallback(() => {
		setIsEditing(false);
		setDraftSets([]);
	}, []);

	/**
	 * Data String Manipulation.
	 * Updates specific set metrics within the sandbox while ensuring type-safe conversion.
	 * @param {string} setId - UUID of the target set.
	 * @param {"weight" | "reps"} field - The specific performance metric to update.
	 * @param {string} value - The raw input value to be recalibrated.
	 */
	const updateSet = useCallback((setId: string, field: "weight" | "reps", value: string) => {
		setDraftSets((prev) => prev.map((s) => (s.id === setId ? { ...s, [field]: value === "" ? 0 : Number(value) } : s)));
	}, []);

	/**
	 * Real-time Volume Projection.
	 * Memoized calculation of total tonnage moved.
	 * Prioritizes the sandbox state during active recalibration.
	 */
	const currentVolume = useMemo(() => {
		const sets = isEditing ? draftSets : (workout?.workout_sets ?? []);
		return sets.reduce((acc, s) => acc + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0);
	}, [isEditing, draftSets, workout]);

	/**
	 * Protocol Commitment.
	 * Triggers the mutation to synchronize the sandbox state with the physical database.
	 */
	const handleSave = useCallback(() => {
		saveChanges({ volume: currentVolume, sets: draftSets }, { onSuccess: () => setIsEditing(false) });
	}, [saveChanges, currentVolume, draftSets]);

	return {
		isEditing,
		draftSets,
		isSaving,
		currentVolume,
		actions: {
			startEditing,
			cancelEditing,
			updateSet,
			handleSave,
		},
	};
};
