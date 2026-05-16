/**
 * @fileoverview Exercise Selection Modal for Analytics.
 * Orchestrates a high-precision selection interface by reusing core library logic.
 * Optimized for mobile-first fullscreen interaction and centered desktop analysis.
 * @module features/analytics/components/modals/ExerciseSelectorModal
 */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, ChevronDown } from "lucide-react";
import { Exercise } from "@/types/exercises";
import { useExercises } from "@/features/exercises/_hooks/use-exercise";
import { useExerciseFilter } from "@/features/exercises/_hooks/use-exercise-filter";
import { ExerciseSearch } from "@/features/exercises/components/ExerciseSearch";
import { MuscleGroupFilter } from "@/features/exercises/components/MuscleGroupFilter";
import { ExerciseList } from "@/features/exercises/components/ExerciseList";
import { ExerciseListSkeleton } from "@/features/exercises/components/ExerciseSkeleton";

/**
 * @interface ExerciseSelectorModalProps
 * @description Properties for the exercise selection gateway.
 * @property {function} onSelect - Callback triggered when an athlete selects a specific protocol (exercise).
 * @property {string} [selectedExerciseName] - Optional label of the currently active analytical target.
 */
interface ExerciseSelectorModalProps {
	onSelect: (exercise: Exercise) => void;
	selectedExerciseName?: string;
}

/**
 * ExerciseSelectorModal Component.
 * * @description
 * Acts as the "Analytical Sights" for the laboratory.
 * 1. **Logic Reuse**: Injects 'useExercises' and 'useExerciseFilter' to maintain
 * functional parity with the primary exercise library.
 * 2. **Performance Scrolling**: Implements a 'flex-1' overflow strategy to ensure
 * the search and filters remain anchored while the list remains scrollable.
 * * @param {ExerciseSelectorModalProps} props - Component properties.
 */
export const ExerciseSelectorModal = ({ onSelect, selectedExerciseName }: ExerciseSelectorModalProps) => {
	const [isOpen, setIsOpen] = useState(false);

	// Headless Logic Synchronization
	const { data: exercises, isLoading } = useExercises();
	const { searchQuery, setSearchQuery, selectedMuscleGroup, setSelectedMuscleGroup, muscleGroups, filteredExercises } = useExerciseFilter(
		exercises || [],
	);

	/**
	 * Finalizes selection and decommissions the modal.
	 * @param {Exercise} exercise - The selected exercise model.
	 */
	const handleSelect = (exercise: Exercise) => {
		onSelect(exercise);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="w-full md:w-[300px] justify-between bg-secondary/10 border-white/5 font-black italic uppercase text-[10px] h-12 tracking-widest hover:bg-primary/10 transition-all"
				>
					<div className="flex items-center gap-2 overflow-hidden">
						<Target size={14} className="text-primary shrink-0" />
						<span className="truncate">{selectedExerciseName || "Select Protocol"}</span>
					</div>
					<ChevronDown size={14} className="opacity-30 shrink-0" />
				</Button>
			</DialogTrigger>

			<DialogContent className="fixed inset-0 translate-x-0 translate-y-0 w-screen h-[100dvh] max-w-none m-0 rounded-none border-none p-0 flex flex-col bg-background shadow-none z-[100] ">
				<div className="p-4 space-y-6 flex flex-col h-full w-full overflow-hidden">
					<div className="space-y-6 shrink-0">
						<DialogHeader className="flex flex-row items-center justify-between">
							<DialogTitle className="text-left font-black italic uppercase tracking-tighter text-2xl">
								Analytical <span className="text-primary font-outline-2">Target</span>
							</DialogTitle>
						</DialogHeader>

						<div className="space-y-4">
							<div className="w-full">
								<ExerciseSearch value={searchQuery} onChange={setSearchQuery} resultsCount={filteredExercises.length} />
							</div>
							<div className="w-full overflow-x-auto no-scrollbar">
								<MuscleGroupFilter groups={muscleGroups} selectedGroup={selectedMuscleGroup} onSelect={setSelectedMuscleGroup} />
							</div>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar pb-20">
						{isLoading ? (
							<ExerciseListSkeleton />
						) : (
							<div className="w-full">
								<ExerciseList exercises={filteredExercises} searchQuery={searchQuery} onItemClick={handleSelect} />
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
