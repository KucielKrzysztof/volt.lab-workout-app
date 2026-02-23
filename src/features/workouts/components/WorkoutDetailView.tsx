"use client";

import { useWorkout } from "../_hooks/use-workout";
import { Timer, Weight, Activity, ChevronLeft, Dumbbell } from "lucide-react";
import Link from "next/link";
import { groupSetsByExercise } from "../helpers/workoutHelpers";
import { Workout, WorkoutSet } from "@/types/workouts";

export const WorkoutDetailView = ({ id, initialData }: { id: string; initialData: Workout }) => {
	const { data: workout } = useWorkout(id, initialData);

	if (!workout) return null;

	const exercises = groupSetsByExercise(workout.workout_sets);

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Header z powrotem */}
			<div className="flex items-center gap-4">
				<Link href="/dashboard/workouts" className="p-2 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-colors">
					<ChevronLeft size={20} />
				</Link>
				<div>
					<h1 className="text-3xl font-black italic uppercase tracking-tighter">{workout.name}</h1>
					<p className="text-muted-foreground text-xs uppercase font-mono tracking-widest">
						{new Date(workout.started_at).toLocaleDateString("pl-PL")}
					</p>
				</div>
			</div>

			{/* Statystyki sesji */}
			<div className="grid grid-cols-3 gap-3">
				<div className="bg-secondary/10 p-4 rounded-2xl border border-white/5  flex flex-col justify-center items-center">
					<Weight className="text-success mb-2" size={20} />
					<p className="text-2xl font-black italic">{workout.total_volume}kg</p>
					<p className="text-[10px] uppercase opacity-40 font-bold">Volume</p>
				</div>
				<div className="bg-secondary/10 p-4 rounded-2xl border border-white/5 flex flex-col justify-center items-center">
					<Timer className="text-primary mb-2" size={20} />
					<p className="text-2xl font-black italic">{Math.floor(workout.duration_seconds / 60)}m</p>
					<p className="text-[10px] uppercase opacity-40 font-bold">Duration</p>
				</div>
				<div className="bg-secondary/10 p-4 rounded-2xl border border-white/5 flex flex-col justify-center items-center">
					<Activity className="text-blue-500 mb-2" size={20} />
					<p className="text-2xl font-black italic">{workout.workout_sets.length}</p>
					<p className="text-[10px] uppercase opacity-40 font-bold">Sets</p>
				</div>
			</div>

			{/* Lista Ćwiczeń */}
			<div className="space-y-6">
				{exercises.map((ex, idx) => (
					<div key={idx} className="bg-secondary/5 border border-white/5 rounded-3xl overflow-hidden shadow-sm">
						{/* Nagłówek ćwiczenia */}
						<div className="p-4 bg-secondary/10 flex items-center justify-between border-b border-white/5">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-primary/10 rounded-xl">
									<Dumbbell size={18} className="text-primary italic" />
								</div>
								<div>
									<h3 className="font-black uppercase italic tracking-tighter text-lg leading-none">{ex.name}</h3>
									<span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">{ex.muscle_group}</span>
								</div>
							</div>
						</div>

						{/* Lista serii [cite: 24-02-2026] */}
						<div className="p-4 space-y-3">
							<div className="grid grid-cols-3 text-[9px] uppercase font-black text-muted-foreground px-2 opacity-50">
								<span>Set</span>
								<span className="text-center">Weight</span>
								<span className="text-center">Reps</span>
							</div>

							{ex.sets.map((set: WorkoutSet, sIdx: number) => (
								<div
									key={set.id}
									className="grid grid-cols-3 items-center bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:border-primary/20"
								>
									<span className="font-mono text-xs font-bold opacity-30">{sIdx + 1}</span>
									<span className="text-center font-black italic">{set.weight}kg</span>
									<span className="text-center font-black italic">{set.reps}</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
