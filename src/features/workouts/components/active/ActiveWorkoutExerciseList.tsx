/**
 * @fileoverview Presentation layer for the active workout exercise collection.
 * Handles the conditional rendering between the exercise tracking list and
 * the empty session state (Ghost State).
 * @module features/workouts/components
 */

"use client";

import { PackageX } from "lucide-react";
import { ActiveExerciseCard } from "./ActiveExerciseCard";
import { ActiveExercise } from "@/types/exercises";

interface Props {
	/** Hierarchical array of exercises and associated performance sets to be rendered. */
	exercises: ActiveExercise[];
}

/**
 * ActiveWorkoutExerciseList Component.
 * * @description
 * A specialized sub-component of the `ActiveWorkoutView` responsible for mapping
 * active session data into interactive tracking units.
 * * **Behavioral Logic:**
 * 1. **Ghost State (Empty Mode)**: Renders a high-contrast visual prompt when a session
 * is initiated via "Quick Start" (On-The-Fly) without any blueprint exercises.
 * 2. **Data Mapping**: Efficiently iterates through the exercise tree, rendering stable
 * `ActiveExerciseCard` components using local UUIDs for optimized React reconciliation.
 * * @param {Props} props - Component properties containing the live exercise stream.
 * @returns {JSX.Element} A containerized list of exercises or a themed empty-state prompt.
 */
export const ActiveWorkoutExerciseList = ({ exercises }: Props) => {
	/** * Renders the "Ghost State" UI.
	 * Triggered when the current session context contains zero movements.
	 */
	if (exercises.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95">
				<PackageX size={50} className="text-primary/70 mb-4" />
				<h1 className="text-2xl uppercase tracking-tighter italic font-bold text-center text-primary/70">no exercises</h1>
				<p className="tracking-tight text-center text-primary/60">Click ADD EXERCISE to select new exercise</p>
			</div>
		);
	}

	/** * Renders the Active Tracking List.
	 * Maps the persistent exercise tree into interactive cards.
	 */
	return (
		<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{exercises.map((ex) => (
				<ActiveExerciseCard key={ex.id} exercise={ex} />
			))}
		</div>
	);
};
