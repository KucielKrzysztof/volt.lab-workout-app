import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorkoutTemplateUI } from "@/types/templates";
import { ActiveExercise, ActiveSet } from "@/types/exercises";

interface ActiveWorkoutStore {
	// --- State ---

	_hasHydrated: boolean;
	id: string | null; // Template ID
	name: string;
	startTime: string | null;
	exercises: ActiveExercise[];

	// --- Actions ---

	setHasHydrated: (state: boolean) => void;
	/** Initializes a new session based on a selected template */
	startFromTemplate: (template: WorkoutTemplateUI) => void;
	updateSet: (exerciseId: string, setId: string, data: Partial<ActiveSet>) => void;
	addSet: (exerciseId: string) => void;
	removeSet: (exerciseId: string, setId: string) => void;
	cancelWorkout: () => void;
}

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

			updateSet: (exId, setId, data) =>
				set((state) => ({
					exercises: state.exercises.map((ex) =>
						ex.id === exId ? { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...data } : s)) } : ex,
					),
				})),

			addSet: (exId) =>
				set((state) => ({
					exercises: state.exercises.map((ex) =>
						ex.id === exId ? { ...ex, sets: [...ex.sets, { id: crypto.randomUUID(), weight: 0, reps: 10, isCompleted: false }] } : ex,
					),
				})),

			removeSet: (exId, setId) =>
				set((state) => ({
					exercises: state.exercises.map((ex) => (ex.id === exId ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) } : ex)),
				})),

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
			 * Wykorzystujemy onRehydrateStorage do automatycznego ustawienia flagi
			 * po załadowaniu danych z localStorage.
			 */
			onRehydrateStorage: (state) => {
				return () => state?.setHasHydrated(true);
			},
		}, // Save to localStorage
	),
);
