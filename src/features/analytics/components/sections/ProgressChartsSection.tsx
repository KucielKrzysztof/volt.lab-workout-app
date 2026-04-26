/**
 * @fileoverview Analytics Preview Section.
 * Renders a high-level consistency chart with a redirection uplink to the full analytical hub.
 * @module features/analytics/components/sections/ProgressChartsSection
 */

interface ProgressChartsSectionProps {
	userId: string;
	year: number;
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyConsistency } from "../../_hooks/use-monthly-consistency";
import { ActivityFrequencyChart, MonthlyFrequency } from "../charts/ActivityFrequencyChart";

/**
 * ProgressChartsSection Component.
 * * @description
 * Acts as the analytical gateway on the main dashboard.
 * 1. **Data Stream**: Connects to 'useMonthlyConsistency' for temporal session grouping.
 * 2. **Visual Feedback**: Toggles between a Skeleton state and the live Recharts bar chart.
 * 3. **Navigation Hub**: Provides a 'Laboratory Uplink' to the deep analytics dashboard.
 */
export const ProgressChartsSection = ({ userId, year }: ProgressChartsSectionProps) => {
	const { data: frequencyData, isLoading } = useMonthlyConsistency(userId, year);

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between px-1">
				<h3 className="text-xs font-black uppercase tracking-widest opacity-50">Monthly Consistency ({year})</h3>
			</div>

			<div className="p-4 bg-secondary/5 border border-white/5 rounded-2xl relative overflow-hidden">
				{/* Visual Accent */}
				<div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />

				{isLoading ? <Skeleton className="h-[250px] w-full bg-primary/5" /> : <ActivityFrequencyChart data={frequencyData || []} />}

				<div className="mt-6 flex justify-center border-t border-white/5 pt-4">
					<Link
						href="/dashboard/analytics/more"
						className="group inline-flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-primary transition-all hover:gap-3"
					>
						See More
						<ChevronRight size={12} className="transition-transform group-hover:scale-125" />
					</Link>
				</div>
			</div>
		</section>
	);
};
