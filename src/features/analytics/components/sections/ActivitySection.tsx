/**
 * @fileoverview Activity Heatmap Orchestrator.
 * Independently fetches and renders the full-year workout distribution.
 * @module features/analytics/components
 */

"use client";

import { useMemo } from "react";
import { generateYearStructure } from "@/features/analytics/utils/calendar-logic";
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
 */
export const ActivitySection = ({ year, userId }: ActivitySectionProps) => {
	// Independent fetch for the full year's dates
	const { data: activityDates, isLoading } = useYearlyActivity(userId, year);

	// Static calendar structure for the selected year
	const structure = useMemo(() => generateYearStructure(year), [year]);

	/** * Data Normalization:
	 * We convert full timestamps to a localized date string format that
	 * matches the internal MonthGrid comparison logic.
	 */
	const history = useMemo(() => {
		if (!activityDates) return [];
		return activityDates.map((date) => new Date(date).toLocaleDateString("pl-PL"));
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
