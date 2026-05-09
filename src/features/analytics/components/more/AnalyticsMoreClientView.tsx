/**
 * @fileoverview High-Density Analytics Dashboard.
 * Orchestrates exercise-specific progression and global volume trends.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, TrendingUp, BarChart3, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/ui/PageHeader";

import { ProgressionLineChart } from "../charts/ProgressionLineChart";
import { Exercise } from "@/types/exercises";
import { ExerciseSelectorModal } from "@/features/exercises/components/ExercisesSelectorModal";

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

			{/* Main Diagnostic: Exercise Progression (Line Chart) */}
			<Card className="p-6 bg-secondary/5 border-white/5 relative overflow-hidden">
				<div className="absolute top-0 left-0 w-1 h-full bg-primary" />
				<div className="flex items-center gap-2 mb-6">
					<TrendingUp size={16} className="text-primary" />
					<h4 className="text-xs font-black uppercase italic tracking-widest">Strength Progression </h4>
				</div>
				{/*  (LineChart) */}
				<ProgressionLineChart exerciseId={selectedExercise} />
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Protocol 02: Total Tonnage per muscle group (weekly) */}
				<Card className="p-6 bg-secondary/5 border-white/5 relative">
					<div className="flex items-center gap-2 mb-6">
						<BarChart3 size={16} className="text-primary" />
						<h4 className="text-xs font-black uppercase italic tracking-widest">Placeholder</h4>
					</div>
					{/* <...Chart /> */}
				</Card>

				{/* Protocol 03: Bio-Distribution (Radar/Pie Chart) -  to see if we maintain the proper balance between the exercised muscle groups  (year stats)*/}
				<Card className="p-6 bg-secondary/5 border-white/5 relative">
					<div className="flex items-center gap-2 mb-6">
						<Target size={16} className="text-primary" />
						<h4 className="text-xs font-black uppercase italic tracking-widest">Muscular Targeting</h4>
					</div>
					{/* <MuscleRadarChart /> */}
				</Card>
			</div>
		</div>
	);
};
