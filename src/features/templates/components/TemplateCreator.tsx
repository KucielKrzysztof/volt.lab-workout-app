"use client";

import { useState } from "react";
import { useUser } from "@/core/providers/UserProvider";
import { useCreateTemplate } from "../_hooks/use-create-template";
import { Button } from "@/components/ui/button";
import { CreateTemplateInput } from "@/types/templates";
import { Input } from "@/components/ui/input";
import { TemplateExerciseRow } from "./TemplateExercisesRow";
import { toast } from "sonner";
import { ExerciseSelector } from "./ExerciseSelector";

interface FormExercise {
	id: string; // exercise_id
	name: string;
	suggested_sets: number;
	suggested_reps: number;
}

export const TemplateCreator = () => {
	const { user } = useUser();
	const { mutate: createTemplate, isPending } = useCreateTemplate(user?.id || "");

	const [name, setName] = useState("");
	const [selectedExercises, setSelectedExercises] = useState<FormExercise[]>([]);

	/** * State Handlers:
	 * Manage the dynamic list of exercises before final submission.
	 */
	const updateExercise = (id: string, updates: Partial<FormExercise>) => {
		setSelectedExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)));
	};

	const removeExercise = (id: string) => {
		setSelectedExercises((prev) => prev.filter((ex) => ex.id !== id));
	};

	const addExercise = (exercise: { id: string; name: string }) => {
		/** * Duplicate Prevention:
		 * Check if the exercise is already in the list to avoid redundant entries [cite: 19-02-2026].
		 */
		if (selectedExercises.some((ex) => ex.id === exercise.id)) {
			return toast.error("Exercise already added to routine!");
		}

		setSelectedExercises((prev) => [
			...prev,
			{
				id: exercise.id,
				name: exercise.name,
				suggested_sets: 3, // Domyślne wartości
				suggested_reps: 10,
			},
		]);

		toast.success(`${exercise.name} added!`);
	};

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

		createTemplate(payload);
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
