/**
 * @fileoverview High-Density Analytics Dashboard.
 * Orchestrates exercise-specific progression, temporal frequency, and muscle distribution profiles.
 * @module features/analytics/components/AnalyticsMoreClientView
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, TrendingUp, BarChart3, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Exercise } from "@/types/exercises";

// Internal Component Dependencies
import { ExerciseSelectorModal } from "@/features/exercises/components/ExercisesSelectorModal";
import { ProgressionLineChart } from "../charts/ProgressionLineChart";
import { MuscleRadarChart } from "../charts/MuscleRadarChart";
import { ActivityFrequencyChart } from "../charts/ActivityFrequencyChart";

// Data Hooks
import { useExerciseProgression, useGlobalMetrics } from "../../_hooks/use-advanced-analytics";

// Interfaces
interface AnalyticsMoreClientViewProps {
	userId: string;
}

export const AnalyticsMoreClientView = ({ userId }: AnalyticsMoreClientViewProps) => {
	const router = useRouter();
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>({
		id: "3b4577d6-6515-4437-bbff-f1c3da5f6bd1",
		name: "Bench Press",
		muscle_group: "Chest",
	});
	const currentYear = new Date().getFullYear();

	// TanStack Query Hooks connected to Supabase
	const { data: progressionData, isLoading: isLoadingProgression } = useExerciseProgression(userId, selectedExercise?.id);
	const { data: globalMetrics, isLoading: isLoadingGlobal } = useGlobalMetrics(userId, currentYear);

	return (
		<div className="space-y-6 pb-24 animate-in fade-in duration-500">
			{/* Navigation Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
						<ChevronLeft size={20} />
					</Button>
					<PageHeader title="Laboratory Hub" icon={<Zap className="text-primary" size={20} />} />
				</div>
			</div>

			{/* Global Exercise Selector */}
			<ExerciseSelectorModal onSelect={setSelectedExercise} selectedExerciseName={selectedExercise?.name} />

			{/* Protocol 01: Exercise Progression (Line Chart) */}
			<Card className="p-6 bg-secondary/5 border-white/5 relative overflow-hidden">
				<div className="flex items-center gap-2 mb-6">
					<TrendingUp size={16} className="text-primary" />
					<h4 className="text-xs font-black uppercase italic tracking-widest">Strength Progression </h4>
				</div>
				{/*  (LineChart) */}
				{isLoadingProgression ? (
					<div className="h-64 w-full bg-primary/5 rounded-xl animate-pulse" />
				) : (
					<ProgressionLineChart data={progressionData || []} />
				)}
			</Card>

			{/* Protocol 02:*/}
			<Card className="p-6 bg-secondary/5 border-white/5 relative overflow-hidden group">
				<div className="flex items-center gap-2 mb-6">
					<BarChart3 size={16} className="text-primary" />
					<h4 className="text-xs font-black uppercase italic tracking-widest text-primary">Protocol: Temporal Consistency</h4>
				</div>

				{/* Reused Recharts Bar Component */}
				{isLoadingGlobal ? (
					<div className="h-[250px] w-full bg-primary/5 rounded-xl animate-pulse" />
				) : (
					<ActivityFrequencyChart data={globalMetrics?.frequency || []} />
				)}

				<p className="mt-4 text-[10px] text-muted-foreground uppercase leading-relaxed font-bold opacity-30 italic">
					* Quantifying chronological workout frequency distribution.
				</p>
			</Card>

			{/* Protocol 03:  Total sets per muscle group (weekly) */}
			<Card className="p-6 bg-secondary/5 border-white/5 relative overflow-hidden group">
				<div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity"></div>

				<div className="flex items-center gap-2 mb-6">
					<Target size={16} className="text-primary" />
					<h4 className="text-xs font-black uppercase italic tracking-widest text-primary">Protocol: Bio-Distribution</h4>
				</div>

				{isLoadingGlobal ? (
					<div className="h-[300px] w-full bg-primary/5 rounded-xl animate-pulse" />
				) : (
					<MuscleRadarChart data={globalMetrics?.radar || []} />
				)}

				<p className="mt-4 text-[10px] text-muted-foreground uppercase leading-relaxed font-bold opacity-30 italic">
					* Based on absolute volume metrics from the last 7 days.
				</p>
			</Card>
		</div>
	);
};
