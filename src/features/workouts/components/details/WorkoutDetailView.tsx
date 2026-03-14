/**
 * @fileoverview Primary Workspace for Workout Session Analytics and Recalibration.
 * Acts as the top-level orchestrator for viewing and modifying historical
 * training data strings.
 * @module features/workouts/components/details/WorkoutDetailView
 */

"use client";

import { useMemo } from "react";
import { useWorkout } from "../../_hooks/use-workout";
import { groupSetsByExercise } from "../../helpers/workoutHelpers";
import { Workout } from "@/types/workouts";
import { useWorkoutEditFlow } from "../../_hooks/details/use-workout-edit-flow";
import { WorkoutDetailHeader } from "./WorkoutDetailHeader";
import { WorkoutDetailToggleEdit } from "./WorkoutDetailToggleEdit";
import { WorkoutDetailOverview } from "./WorkoutDetailOverview";
import { WorkoutDetailExercises } from "./WorkoutDetailExercises";

/**
 * WorkoutDetailView Component.
 * * @description
 * High-fidelity workstation that serves as the central hub for individual workout sessions.
 * It coordinates data acquisition, relational state mapping, and the editing lifecycle.
 * * **Core Responsibilities:**
 * 1. **Data Orchestration**: Synchronizes server-side hydrated data with client-side TanStack Query cache.
 * 2. **State Transitioning**: Manages the switch between static historical viewing and the 'Draft' edit mode.
 * 3. **Relational Synthesis**: Utilizes memoized grouping to transform flat set arrays into hierarchical exercise cards.
 * 4. **KPI Projection**: Aggregates real-time volume and density metrics during recalibration.
 * * @param {Object} props - Component properties.
 * @param {string} props.id - The unique UUID of the workout session.
 * @param {Workout} props.initialData - SSR-provided data to ensure zero-flicker hydration.
 * @returns {JSX.Element | null} The orchestrated detail interface.
 */
export const WorkoutDetailView = ({ id, initialData }: { id: string; initialData: Workout }) => {
	/** * Reactive Data Fetching:
	 * Synchronizes the component with the TanStack Query cache.
	 * Prioritizes 'initialData' for the first render to eliminate layout shifts.
	 */
	const { data: workout } = useWorkout(id, initialData);

	/** * Headless Edit Flow:
	 * Manages the transient 'Draft' state and mutation triggers for record updates.
	 */
	const editFlow = useWorkoutEditFlow(workout);

	/** * Data Transformation Layer:
	 * Rebuilds the exercise hierarchy whenever the underlying sets or edit mode change.
	 * Prioritizes the 'Draft' state during active recalibration.
	 */
	const groupedExercises = useMemo(() => {
		if (!workout) return [];
		return groupSetsByExercise(editFlow.isEditing ? editFlow.draftSets : workout.workout_sets);
	}, [workout, editFlow.isEditing, editFlow.draftSets]);

	/** * Guard Clause:
	 * Prevents UI corruption if the record is decommissioned or not yet resolved.
	 */
	if (!workout) return null;

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Identity Layer: Navigation and Session Labeling */}
			<WorkoutDetailHeader workoutName={workout.name} startedAt={workout.started_at} />

			{/* Command Layer: Mode Switching and Persistence Triggers */}
			<WorkoutDetailToggleEdit
				isEditing={editFlow.isEditing}
				isSaving={editFlow.isSaving}
				onStart={editFlow.actions.startEditing}
				onCancel={editFlow.actions.cancelEditing}
				onSave={editFlow.actions.handleSave}
			/>

			{/* Metric Layer: Dynamic Projection of Session KPIs */}
			<WorkoutDetailOverview
				isEditing={editFlow.isEditing}
				volume={editFlow.currentVolume}
				durationSeconds={workout.duration_seconds}
				totalSets={workout.workout_sets.length}
			/>

			{/* Performance Layer: Detailed Exercise and Set Breakdown */}
			<WorkoutDetailExercises exercises={groupedExercises} isEditing={editFlow.isEditing} onUpdateSet={editFlow.actions.updateSet} />
		</div>
	);
};
