"use client";

import { useMemo, useState } from "react";
import { YearPicker } from "@/features/analytics/components/YearPicker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CalendarDays, BarChart3, Trophy } from "lucide-react";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { ActivitySection } from "./sections/ActivitySection";
import { ProgressChartsSection } from "./sections/ProgressChartsSection";
import { RecordsSection } from "./sections/RecordsSection";
import { SummarySection } from "./sections/SummarySection";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/profile";
import { useProfile } from "@/features/profile/_hooks/use-profile";

import { useWorkouts } from "@/features/workouts/_hooks/use-workouts";
import { formatDuration, formatVolume } from "@/lib/formatter";

interface AnalyticsClientViewProps {
	userId: string;
	/** Server-side fetched profile data to ensure instant UI hydration and zero CLS. */
	initialProfile: UserProfile | null;
}

/**
 * Main Client-Side Orchestrator for the Analytics Dashboard.
 * * Features:
 * - **Data Hydration**: Uses server-side initial profile data while maintaining real-time sync via useProfile.
 * - **State Management**: Controls global year selection affecting all sub-sections.
 * - **Dynamic Layout**: Organizes detailed metrics into collapsible segments for a clean, mobile-first experience.
 * - **Records Integration**: Directly bridges the Profile JSONB records into the Analytics progression view.
 * * @param {AnalyticsClientViewProps} props - Component properties.
 */
export default function AnalyticsClientView({ userId, initialProfile }: AnalyticsClientViewProps) {
	/** Local state for year-based filtering across all analytics modules. */
	const [year, setYear] = useState(new Date().getFullYear());

	/** * Synchronized profile data hook.
	 * Ensures that any updates to Personal Records in other parts of the app are reflected here.
	 */
	const { profile } = useProfile(userId, initialProfile);

	const { data: workouts } = useWorkouts(userId);

	const stats = useMemo(() => {
		const defaultStats = {
			workouts: 0,
			duration: "0:00:00",
			sets: 0,
			volume: "0 kg",
		};

		if (!workouts) return defaultStats;

		// Filtrujemy po roku (korzystając z displayDate lub started_at)
		const filteredWorkouts = workouts.filter((w) => w.displayDate.includes(year.toString()));

		const totals = filteredWorkouts.reduce(
			(acc, w) => ({
				volume: acc.volume + w.total_volume,
				duration: acc.duration + w.duration_seconds,
				sets: acc.sets + w.totalSets,
			}),
			{ volume: 0, duration: 0, sets: 0 },
		);

		return {
			workouts: filteredWorkouts.length,
			duration: formatDuration(totals.duration),
			sets: totals.sets,
			volume: formatVolume(totals.volume),
		};
	}, [workouts, year]);

	if (!workouts || !userId) return;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Sticky header with Year selection capability */}
			<AnalyticsHeader>
				<YearPicker year={year} onYearChange={setYear} />
			</AnalyticsHeader>
			<Separator />

			{/* High-level aggregate statistics */}
			<SummarySection stats={stats} />

			<Separator />

			{/* Detailed sections grouped by category */}
			<Accordion type="single" collapsible className="w-full space-y-4">
				{/* ACTIVITY */}
				<AccordionItem value="activity" className="border-none bg-secondary/10 rounded-xl px-4">
					<AccordionTrigger className="hover:no-underline py-4">
						<div className="flex items-center gap-3 font-bold tracking-tight uppercase">
							<CalendarDays className="text-primary w-5 h-5" /> Activity Grid
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<ActivitySection year={year} workouts={workouts} />
					</AccordionContent>
				</AccordionItem>

				{/* CHARTS */}
				<AccordionItem value="charts" className="border-none bg-secondary/10 rounded-xl px-4">
					<AccordionTrigger className="hover:no-underline py-4">
						<div className="flex items-center gap-3 font-bold tracking-tight uppercase">
							<BarChart3 className="text-primary w-5 h-5" /> Progression Charts
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<ProgressChartsSection year={year} />
					</AccordionContent>
				</AccordionItem>

				{/* RECORDS */}
				<AccordionItem value="records" className="border-none bg-secondary/10 rounded-xl px-4">
					<AccordionTrigger className="hover:no-underline py-4">
						<div className="flex items-center gap-3 font-bold tracking-tight uppercase">
							<Trophy className="text-primary w-5 h-5" /> Personal Records
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<RecordsSection records={profile?.personal_records || []} year={year} />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
