import { useMemo } from "react";
import { generateYearStructure } from "@/features/analytics/utils/calendar-logic";
import { MonthGrid } from "@/features/analytics/components/MonthGrid";

interface ActivitySectionProps {
	year: number;
	history: string[];
}

/**
 * Renders the full-year activity heatmaps.
 * Maps through the generated year structure to display individual MonthGrids.
 * Optimized with useMemo to prevent unnecessary recalculations of calendar logic.
 */

export const ActivitySection = ({ year, history }: ActivitySectionProps) => {
	const structure = useMemo(() => generateYearStructure(year), [year]);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
			{structure.map((m) => (
				<MonthGrid key={m.name} monthName={m.name} days={m.days} history={history} />
			))}
		</div>
	);
};
