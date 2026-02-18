"use client";

import { StartWorkoutCard } from "@/features/workouts/components/StartWorkoutCard";
import { WorkoutHistory } from "@/features/workouts/components/WorkoutsHistory";

import { Workout } from "@/features/workouts/types/workouts";
import { WorkoutsClientHeader } from "./WorkoutsClientHeader";

interface WorkoutClientViewProps {
	workouts: Workout[];
}

export const WorkoutsClientView = ({ workouts }: WorkoutClientViewProps) => {
	return (
		<div className="flex flex-col space-y-10 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
			<WorkoutsClientHeader />
			<StartWorkoutCard />
			<WorkoutHistory workouts={workouts} />
		</div>
	);
};
