"use client";

import { useState } from "react";
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

const MOCK_HISTORY = ["2026-02-16", "2026-02-14", "2026-02-12", "2026-02-11"];

const MOCK_STATS = {
	workouts: 12,
	duration: "8:41:00",
	exercises: 26,
	sets: 155,
	reps: "1,520",
	volume: "185,852 kg",
};

interface AnalyticsClientViewProps {
	userId: string | undefined;
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

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Sticky header with Year selection capability */}
			<AnalyticsHeader>
				<YearPicker year={year} onYearChange={setYear} />
			</AnalyticsHeader>
			<Separator />

			{/* High-level aggregate statistics */}
			<SummarySection stats={MOCK_STATS} />

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
						<ActivitySection year={year} history={MOCK_HISTORY} />
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
