"use client";

import { useMemo } from "react";
import { generateYearStructure } from "@/features/analytics/utils/calendar-logic";
import { MonthGrid } from "@/features/analytics/components/MonthGrid";
import { WorkoutUI } from "@/types/workouts";

interface ActivitySectionProps {
	year: number;
	workouts: WorkoutUI[];
}

/**
 * Renders the full-year activity heatmaps.
 * Maps through the generated year structure to display individual MonthGrids.
 * Optimized with useMemo to prevent unnecessary recalculations of calendar logic.
 */

export const ActivitySection = ({ year, workouts }: ActivitySectionProps) => {
	const structure = useMemo(() => generateYearStructure(year), [year]);

	const history = workouts?.map((w) => w.displayDate) || [];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
			{structure.map((m) => (
				<MonthGrid key={m.name} monthName={m.name} days={m.days} history={history} />
			))}
		</div>
	);
};
