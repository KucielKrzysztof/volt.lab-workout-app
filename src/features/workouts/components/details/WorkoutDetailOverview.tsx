/**
 * @fileoverview Performance Overview Dashboard for Workout Details.
 * Renders the primary session KPIs (Volume, Duration, Sets) with reactive
 * updates during the laboratory recalibration (editing) phase.
 * @module features/workouts/components/details/WorkoutDetailOverview
 */

import { cn } from "@/lib/utils";
import { Activity, Timer, Weight } from "lucide-react";

/**
 * @interface WorkoutDetailOverviewProps
 * @description Logic mapping for the session's primary performance indicators.
 * @property {boolean} isEditing - Active toggle state reflecting the draft sandbox status.
 * @property {number} volume - Pre-calculated cumulative tonnage ($V = \sum weight \times reps$).
 * @property {number} durationSeconds - Total elapsed time of the session in seconds.
 * @property {number} totalSets - Total count of performance sets completed.
 */
interface WorkoutDetailOverviewProps {
	isEditing: boolean;
	volume: number;
	durationSeconds: number;
	totalSets: number;
}

/**
 * WorkoutDetailOverview Component.
 * * @description
 * High-visibility dashboard that projects the core metrics of a workout session.
 * It features a reactive "Live Volume" indicator that pulses during edit mode
 * to signal active data recalibration.
 * * @returns {JSX.Element} The rendered KPI grid.
 */
export const WorkoutDetailOverview = ({ isEditing, volume, durationSeconds, totalSets }: WorkoutDetailOverviewProps) => {
	return (
		<div className="grid grid-cols-3 gap-3">
			{/* 1. Cumulative Volume Card: 
                Shows real-time tonnage from 'currentVolume' provided by the hook. 
            */}
			<StatCard
				label="Volume"
				value={`${volume}kg`}
				icon={<Weight className={cn("transition-colors", isEditing ? "text-primary animate-pulse" : "text-success")} size={20} />}
			/>

			{/* 2. Temporal Card: 
                Converts raw seconds into minutes for high-level monitoring. 
            */}
			<StatCard label="Duration" value={`${Math.floor(durationSeconds / 60)}m`} icon={<Timer className="text-primary" size={20} />} />

			{/* 3. Density Card: 
                Displays total completed sets within the session. 
            */}
			<StatCard label="Sets" value={totalSets.toString()} icon={<Activity className="text-blue-500" size={20} />} />
		</div>
	);
};

/**
 * Atomic Stat Card Primitive.
 * * @description
 * A standardized UI container for individual workout metrics.
 * Optimized for scannability with high-contrast typography and tabular numeral alignment.
 */
const StatCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
	<div className="bg-secondary/10 p-4 rounded-2xl border border-white/5 flex flex-col justify-center items-center shadow-sm">
		<div className="mb-2">{icon}</div>
		<p className="text-2xl font-black italic tabular-nums tracking-tight">{value}</p>
		<p className="text-[10px] uppercase opacity-40 font-bold tracking-widest">{label}</p>
	</div>
);
