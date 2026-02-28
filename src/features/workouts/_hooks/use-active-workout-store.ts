/**
 * @fileoverview Global state management for active workout sessions.
 * Orchestrates real-time training data, set tracking, and local persistence
 * using Zustand with a synchronized localStorage middleware.
 * @module features/workouts/hooks
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorkoutTemplateUI } from "@/types/templates";
import { ActiveExercise, ActiveSet } from "@/types/exercises";

/**
 * Interface defining the operational state and actions for the active workout tracker.
 * * @description
 * This store acts as the "Single Source of Truth" for an ongoing training session.
 * It is designed to be highly reactive, ensuring that UI components like the
 * `ActiveWorkoutBanner` and `ActiveWorkoutView` are always in sync with user input.
 */
interface ActiveWorkoutStore {
	// --- STATE DEFINITIONS ---

	/** * Flag indicating if the store has successfully restored data from localStorage.
	 * Critical for preventing hydration mismatches between Server and Client in Next.js.
	 */
	_hasHydrated: boolean;
	id: string | null; // The UUID of the template blueprint used to initiate this session
	name: string; // The display name of the current workout session.
	startTime: string | null; //ISO string representing the exact moment the session was initiated. Used for elapsed time calculations.
	exercises: ActiveExercise[]; // Hierarchical array of exercises and their associated performance sets.

	// --- ACTION DEFINITIONS ---

	/** Sets the hydration status after store initialization. */
	setHasHydrated: (state: boolean) => void;

	/** * Initializes a new workout session based on a provided routine blueprint.
	 * @param {WorkoutTemplateUI} template - The UI-mapped template record containing movements and suggested volume.
	 */
	startFromTemplate: (template: WorkoutTemplateUI) => void;

	/**
	 * Updates a specific set's metrics (weight, reps, completion status).
	 * @param {string} exerciseId - Local UI UUID of the parent exercise.
	 * @param {string} setId - Local UI UUID of the specific set.
	 * @param {Partial<ActiveSet>} data - Object containing the fields to be patched.
	 */
	updateSet: (exerciseId: string, setId: string, data: Partial<ActiveSet>) => void;

	/** Appends a new set to a specific exercise with default metrics. */
	addSet: (exerciseId: string) => void;

	/** Removes a specific set from an exercise. */
	removeSet: (exerciseId: string, setId: string) => void;

	/** Resets the entire store state, effectively discarding the current session. */
	cancelWorkout: () => void;
}

/**
 * Zustand store implementation with persistence middleware.
 * * @description
 * This store utilizes the `persist` middleware to automatically synchronize the
 * active workout state with the browser's `localStorage` under the key `volt-active-session`.
 * * **Persistence Logic:**
 * Every state change (e.g., ticking a set as "Done") is immediately mirrored in
 * local storage, providing high reliability in low-connectivity environments
 * like gym basements where page reloads are common.
 */
export const useActiveWorkoutStore = create<ActiveWorkoutStore>()(
	persist(
		(set) => ({
			// --- INITIAL STATE ---

			_hasHydrated: false,
			id: null,
			name: "",
			startTime: null,
			exercises: [],

			// --- ACTIONS ---

			setHasHydrated: (state) => set({ _hasHydrated: state }),

			/**
			 * Maps a static training blueprint into an active, editable session.
			 * * @description
			 * Performs a deep transformation of template data:
			 * 1. Generates local unique IDs using `crypto.randomUUID()` for stable React rendering.
			 * 2. Maps suggested volume into editable set objects.
			 * 3. Captures the current timestamp as the definitive `startTime`.
			 */
			startFromTemplate: (template) => {
				const exercises = template.exercises.map((ex) => ({
					id: crypto.randomUUID(), // Local unique ID for UI
					exercise_id: ex.id,
					name: ex.name,
					sets: Array.from({ length: ex.sets }).map(() => ({
						id: crypto.randomUUID(),
						weight: 0,
						reps: ex.reps,
						isCompleted: false,
					})),
				}));

				set({
					id: template.id,
					name: template.name,
					startTime: new Date().toISOString(),
					exercises: exercises,
				});
			},

			/** Patches a specific set within the state tree using a deep-mapping approach. */
			updateSet: (exId, setId, data) =>
				set((state) => ({
					exercises: state.exercises.map((ex) =>
						ex.id === exId ? { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...data } : s)) } : ex,
					),
				})),

			/** Appends a standard set (10 reps, 0kg) to the target exercise's set array. */
			addSet: (exId) =>
				set((state) => ({
					exercises: state.exercises.map((ex) =>
						ex.id === exId ? { ...ex, sets: [...ex.sets, { id: crypto.randomUUID(), weight: 0, reps: 10, isCompleted: false }] } : ex,
					),
				})),

			/** Filters out the target set from the exercise's collection. */
			removeSet: (exId, setId) =>
				set((state) => ({
					exercises: state.exercises.map((ex) => (ex.id === exId ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) } : ex)),
				})),

			/** Atomic reset of the session state. Used after successful save or manual discard. */
			cancelWorkout: () =>
				set({
					id: null,
					name: "",
					startTime: null,
					exercises: [],
				}),
		}),
		{
			name: "volt-active-session",
			/**
			 * Orchestrates the transition from serialized storage to active React state.
			 * Ensures that the `_hasHydrated` flag is flipped only after data is ready.
			 */
			onRehydrateStorage: (state) => {
				return () => state?.setHasHydrated(true);
			},
		}, // Save to localStorage
	),
);
