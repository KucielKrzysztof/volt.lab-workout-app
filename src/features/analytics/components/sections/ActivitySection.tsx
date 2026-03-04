/**
 * @fileoverview Activity Heatmap Orchestrator.
 * Independently fetches and renders the full-year workout distribution.
 * @module features/analytics/components
 */

"use client";

import { useMemo } from "react";
import { formatToUIDate, generateYearStructure } from "@/features/analytics/utils/calendar-logic";
import { MonthGrid } from "@/features/analytics/components/MonthGrid";
import { useYearlyActivity } from "../../_hooks/use-yearly-activity";
import { Loader2 } from "lucide-react";

interface ActivitySectionProps {
	year: number;
	userId: string;
}

/**
 * Renders the full-year activity heatmaps using an independent data stream.
 * * @description
 * This component implements the **Activity Snapshot Pattern**. It bypasses the
 * paginated workout feed to fetch a lightweight array of all timestamps for the
 * selected year, ensuring the heatmap is always 100% accurate.
 * * @param {ActivitySectionProps} props - Component props.
 * @returns {JSX.Element} The rendered activity grid or a loading state.
 */
export const ActivitySection = ({ year, userId }: ActivitySectionProps) => {
	/** * Data Acquisition:
	 * Fetches a lightweight array of all workout timestamps for the specified year.
	 * This stream is independent of the main feed to maintain 100% accuracy.
	 */
	const { data: activityDates, isLoading } = useYearlyActivity(userId, year);

	/** * Structural Logic:
	 * Generates the visual skeleton of the calendar (months and day strings).
	 * Memoized to prevent recalculation on parent re-renders.
	 */
	const structure = useMemo(() => generateYearStructure(year), [year]);

	/** * Data Normalization:
	 * Converts raw database timestamps into the application's global date format.
	 * Crucial for the `history.includes(date)` check inside the MonthGrid.
	 */
	const history = useMemo(() => {
		if (!activityDates) return [];

		// Single Source of Truth: Mapping via shared utility
		return activityDates.map(formatToUIDate);
	}, [activityDates]);

	if (isLoading) {
		return (
			<div className="w-full py-20 flex flex-col items-center gap-2 opacity-20">
				<Loader2 className="animate-spin w-6 h-6" />
				<p className="text-[10px] uppercase font-bold tracking-tighter">Scanning Activity...</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 animate-in fade-in duration-700">
			{structure.map((m) => (
				<MonthGrid key={m.name} monthName={m.name} days={m.days} history={history} />
			))}
		</div>
	);
};
