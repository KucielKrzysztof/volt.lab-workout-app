/**
 * @fileoverview Workout Routine Builder & Editor.
 * Handles complex local state management for exercise selection, volume
 * configuration, and dual-mode (Create/Edit) relational persistence.
 * @module features/templates/components
 */

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/core/providers/UserProvider";
import { useCreateTemplate } from "../_hooks/use-create-template";
import { Button } from "@/components/ui/button";
import { CreateTemplateInput, WorkoutTemplateUI } from "@/types/templates";
import { Input } from "@/components/ui/input";
import { TemplateExerciseRow } from "./TemplateExercisesRow";
import { toast } from "sonner";
import { ExerciseSelector } from "./ExerciseSelector";
import { useEditTemplate } from "../_hooks/use-edit-template";

/**
 * Interface representing an exercise entry within the local form state.
 * @typedef {Object} FormExercise
 * @property {string} id - The UUID of the exercise from the library (mapped to exercise_id).
 * @property {string} name - The display name of the movement.
 * @property {number} suggested_sets - Default set count for the routine (initializes to 3).
 * @property {number} suggested_reps - Default repetition count (initializes to 10).
 */
interface FormExercise {
	id: string; // exercise_id
	name: string;
	suggested_sets: number;
	suggested_reps: number;
}

/**
 * Component Configuration Props.
 * @interface TemplateCreatorProps
 * @property {"create" | "edit"} [mode="create"] - Determines the persistence strategy.
 * @property {WorkoutTemplateUI} [initialData] - Data used for state hydration in 'edit' mode.
 */
interface TemplateCreatorProps {
	mode?: "create" | "edit";
	initialData?: WorkoutTemplateUI;
}

/**
 * TemplateCreator Component.
 * * @description
 * A sophisticated form orchestrator for training blueprints. It allows users to
 * assemble routines, fine-tune volume, and manage relational persistence.
 * * **Core Capabilities:**
 * 1. **Polymorphic Persistence**: Dynamically switches between `createTemplate` and
 * `editTemplate` mutations based on the operational mode.
 * 2. **Isomorphic Hydration**: Automatically populates the form state from
 * `initialData` when in 'edit' mode, ensuring instant UI readiness.
 * 3. **Relational Integrity**: Maps internal `FormExercise` state to the strict
 * `CreateTemplateInput` DTO required by the API service.
 * 4. **Duplicate Guard**: Prevents redundant exercise entries within a single routine.
 * * @param {TemplateCreatorProps} props - Component properties.
 * @returns {JSX.Element} The routine builder interface with state-aware transitions.
 */
export const TemplateCreator = ({ mode = "create", initialData }: TemplateCreatorProps) => {
	/** * User context for scoping the creation mutation. */
	const { user } = useUser();

	/** * Mutation Hooks:
	 * Independent streams for creating new routines or recalibrating existing ones.
	 */
	const { mutate: createTemplate, isPending: isCreating } = useCreateTemplate(user?.id || "");
	const { mutate: editTemplate, isPending: isEditing } = useEditTemplate(initialData?.id || "");

	/** * Form state for the routine header. */
	const [name, setName] = useState("");

	/** * Hierarchical state for the routine line items (exercises). */
	const [selectedExercises, setSelectedExercises] = useState<FormExercise[]>([]);

	/** * HYDRATION LOGIC:
	 * Synchronizes the internal form state with provided cache data upon mounting
	 * in 'edit' mode. This facilitates the "Cache-First" editing strategy.
	 */
	useEffect(() => {
		if (mode === "edit" && initialData) {
			setName(initialData.name);
			setSelectedExercises(
				initialData.exercises.map((ex) => ({
					id: ex.id,
					name: ex.name,
					suggested_sets: ex.sets,
					suggested_reps: ex.reps,
				})),
			);
		}
	}, [mode, initialData]);

	/** * Loading Sentinel:
	 * Aggregated pending state to disable interactions during synchronization.
	 */
	const isPending = isCreating || isEditing;

	/** * Updates specific volume metrics for a targeted exercise row.
	 * @param {string} id - The UUID of the exercise row to update.
	 * @param {Partial<FormExercise>} updates - The fields to be patched (sets/reps).
	 */
	const updateExercise = (id: string, updates: Partial<FormExercise>) => {
		setSelectedExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)));
	};

	/** * Removes an exercise line from the routine list.
	 * @param {string} id - The UUID of the exercise to filter out.
	 */
	const removeExercise = (id: string) => {
		setSelectedExercises((prev) => prev.filter((ex) => ex.id !== id));
	};

	/** * Appends a new movement to the routine blueprint with default volume.
	 * * @description
	 * Implements a check against `selectedExercises` to prevent redundant entries.
	 * If valid, it initializes the movement with 3 sets and 10 reps.
	 * @param {Object} exercise - The raw exercise metadata from the selector.
	 */
	const addExercise = (exercise: { id: string; name: string }) => {
		/** * Duplicate Prevention:
		 * Check if the exercise is already in the list to avoid redundant entries
		 */
		if (selectedExercises.some((ex) => ex.id === exercise.id)) {
			return toast.error("Exercise already added to routine!");
		}

		setSelectedExercises((prev) => [
			...prev,
			{
				id: exercise.id,
				name: exercise.name,
				suggested_sets: 3, // default
				suggested_reps: 10,
			},
		]);

		toast.success(`${exercise.name} added!`);
	};

	/** * Validates and dispatches the creation payload.
	 * * @description
	 * Prevents submission if the routine name is blank or the list is empty.
	 * Maps the local state to the `CreateTemplateInput` interface:
	 * - `id` $\rightarrow$ `exercise_id`
	 * - `suggested_sets`
	 * - `suggested_reps`
	 */
	const handleSave = () => {
		if (!name.trim() || selectedExercises.length === 0) return;

		const payload: CreateTemplateInput = {
			name,
			exercises: selectedExercises.map((ex) => ({
				exercise_id: ex.id,
				suggested_sets: ex.suggested_sets,
				suggested_reps: ex.suggested_reps,
			})),
		};

		if (mode === "edit") {
			editTemplate(payload);
		} else {
			createTemplate(payload);
		}
	};

	return (
		<div className="space-y-8 w-full max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<header className="space-y-2">
				<h1 className="text-2xl font-black tracking-tighter italic uppercase text-center">Create Routine</h1>
				<Input
					placeholder="E.g., Upper Body Power"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="bg-secondary/20 border-primary/10 text-xl font-bold p-6 focus:border-primary/50 transition-all"
				/>
			</header>

			<div className="space-y-4">
				<div className="flex justify-between items-center px-1">
					<h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Exercises ({selectedExercises.length})</h2>
					<ExerciseSelector onSelect={addExercise} />
				</div>

				<div className="space-y-3">
					{selectedExercises.map((ex) => (
						<TemplateExerciseRow key={ex.id} exercise={ex} onUpdate={updateExercise} onRemove={removeExercise} />
					))}
				</div>
			</div>

			<Button
				onClick={handleSave}
				disabled={isPending}
				className="w-full bg-primary text-primary-foreground font-black uppercase italic tracking-widest py-8 hover:opacity-90 active:scale-[0.98] transition-all"
			>
				{isPending ? "Syncing with Command Center..." : "Save Routine"}
			</Button>
		</div>
	);
};
