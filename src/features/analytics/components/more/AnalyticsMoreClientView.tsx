/**
 * @fileoverview High-Density Analytics Dashboard.
 * Orchestrates exercise-specific progression and global volume trends.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, TrendingUp, Target, Zap, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressionLineChart } from "../charts/ProgressionLineChart";
import { Exercise } from "@/types/exercises";
import { ExerciseSelectorModal } from "@/features/exercises/components/ExercisesSelectorModal";
import { MuscleRadarChart } from "../charts/MuscleRadarChart";
import { ActivityFrequencyChart, MonthlyFrequency } from "../charts/ActivityFrequencyChart";

/**
 * Mock dataset engineered to satisfy the MonthlyFrequency contract.
 * Represents seasonal training volume across the current block.
 */
const MOCK_FREQUENCY_DATA: MonthlyFrequency[] = [
	{ month: "JAN", count: 14 },
	{ month: "FEB", count: 16 },
	{ month: "MAR", count: 18 },
	{ month: "APR", count: 15 },
	{ month: "MAY", count: 22 },
	{ month: "JUN", count: 12 },
];

export const AnalyticsMoreClientView = () => {
	const router = useRouter();
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
				<ProgressionLineChart exerciseId={selectedExercise?.id || ""} />
			</Card>

			{/* Protocol 02:*/}
			<Card className="p-6 bg-secondary/5 border-white/5 relative overflow-hidden group">
				<div className="flex items-center gap-2 mb-6">
					<BarChart3 size={16} className="text-primary" />
					<h4 className="text-xs font-black uppercase italic tracking-widest text-primary">Protocol: Temporal Consistency</h4>
				</div>

				{/* Reused Recharts Bar Component */}
				<ActivityFrequencyChart data={MOCK_FREQUENCY_DATA} />

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

				<MuscleRadarChart />

				<p className="mt-4 text-[10px] text-muted-foreground uppercase leading-relaxed font-bold opacity-30 italic">
					* Based on aggregate volume metrics for the current cycle.
				</p>
			</Card>
		</div>
	);
};
