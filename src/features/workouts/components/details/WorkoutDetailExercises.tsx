/**
 * @fileoverview Exercise Performance Layer for Workout Details.
 * Orchestrates the rendering of hierarchical exercise cards and manages
 * the input matrix during session recalibration.
 * @module features/workouts/components/details/WorkoutDetailExercises
 */

import { Dumbbell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WorkoutSet } from "@/types/workouts";
import { GroupedWorkoutExercise } from "@/types/exercises";

/**
 * @interface WorkoutDetailExercisesProps
 * @description Logic mapping for the hierarchical exercise performance stream.
 * @property {GroupedWorkoutExercise[]} exercises - Array of movements grouped with their respective sets.
 * @property {boolean} isEditing - Global toggle state for the recalibration sandbox.
 * @property {Function} onUpdateSet - Atomic callback to modify specific set metrics in the draft state.
 */
interface WorkoutDetailExercisesProps {
	exercises: GroupedWorkoutExercise[];
	isEditing: boolean;
	onUpdateSet: (setId: string, field: "weight" | "reps", value: string) => void;
}

/**
 * WorkoutDetailExercises Component.
 * * @description
 * Primary container for the performance breakdown of a workout session.
 * Iterates through grouped data strings to render specialized diagnostic cards.
 * * @returns {JSX.Element} The orchestrated list of exercise performance blocks.
 */
export const WorkoutDetailExercises = ({ exercises, isEditing, onUpdateSet }: WorkoutDetailExercisesProps) => {
	return (
		<div className="space-y-6">
			{exercises.map((ex, idx) => (
				<ExercisePerformanceCard key={`${ex.name}-${idx}`} exercise={ex} isEditing={isEditing} onUpdateSet={onUpdateSet} />
			))}
		</div>
	);
};

/**
 * @interface ExercisePerformanceCardProps
 * @description Internal contract for the atomic exercise unit.
 */
interface ExercisePerformanceCardProps {
	exercise: GroupedWorkoutExercise;
	isEditing: boolean;
	onUpdateSet: (setId: string, field: "weight" | "reps", value: string) => void;
}

/**
 * ExercisePerformanceCard Component.
 * * @description
 * An atomic unit representing a single movement performed during the session.
 * Features a dual-state matrix:
 * 1. **Analysis Mode**: High-contrast read-only performance rows.
 * 2. **Recalibration Mode**: Interactive input grid with high-velocity focus logic.
 */
const ExercisePerformanceCard = ({ exercise, isEditing, onUpdateSet }: ExercisePerformanceCardProps) => (
	<div className="bg-secondary/5 border border-white/5 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-white/10">
		{/* Header: Exercise Identity */}
		<div className="p-4 bg-secondary/10 flex items-center gap-3 border-b border-white/5">
			<div className="p-2 bg-primary/10 rounded-xl">
				<Dumbbell size={18} className="text-primary italic" />
			</div>
			<div>
				<h3 className="font-black uppercase italic tracking-tighter text-lg leading-none">{exercise.name}</h3>
				<span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">{exercise.muscle_group}</span>
			</div>
		</div>

		{/* Set Performance Matrix */}
		<div className="p-4 space-y-3">
			{/* Legend */}
			<div className="grid grid-cols-3 text-[9px] uppercase font-black text-muted-foreground px-2 opacity-50">
				<span>Set</span>
				<span className="text-center">Weight</span>
				<span className="text-center">Reps</span>
			</div>

			{/* Performance Rows */}
			{exercise.sets.map((set: WorkoutSet, sIdx: number) => (
				<div
					key={set.id}
					className="grid grid-cols-3 items-center bg-white/5 p-2 rounded-xl border border-white/5 gap-4 transition-all focus-within:border-primary/40"
				>
					<span className="font-mono text-xs font-bold opacity-30 px-2">{sIdx + 1}</span>

					{isEditing ? (
						<>
							{/* Weight Input (With KG label protection) */}
							<div className="relative group">
								<Input
									type="number"
									value={set.weight || ""}
									onFocus={(e) => e.target.select()}
									onChange={(e) => onUpdateSet(set.id, "weight", e.target.value)}
									className="h-10 bg-background border-primary/10 text-center font-black italic pr-7 focus:ring-1 focus:ring-primary/30"
								/>
								<span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] opacity-30 font-bold group-focus-within:opacity-100 transition-opacity">
									KG
								</span>
							</div>

							{/* Reps Input */}
							<div className="relative group">
								<Input
									type="number"
									value={set.reps || ""}
									onFocus={(e) => e.target.select()}
									onChange={(e) => onUpdateSet(set.id, "reps", e.target.value)}
									className="h-10 bg-background border-primary/10 text-center font-black italic focus:ring-1 focus:ring-primary/30"
								/>
								<span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] opacity-30 font-bold group-focus-within:opacity-100 transition-opacity uppercase">
									Rps
								</span>
							</div>
						</>
					) : (
						<>
							<span className="text-center font-black italic text-lg tabular-nums">{set.weight}kg</span>
							<span className="text-center font-black italic text-lg tabular-nums">{set.reps}</span>
						</>
					)}
				</div>
			))}
		</div>
	</div>
);
