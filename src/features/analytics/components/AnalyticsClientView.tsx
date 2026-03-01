/**
 * @fileoverview Main View Orchestrator for the VOLT.LAB Analytics Dashboard.
 * Coordinates the visual assembly of various data visualization modules,
 * consuming processed metrics from the dedicated analytics engine hook.
 * @module features/analytics/components
 */

"use client";

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
import { useAnalyticsDashboard } from "../_hooks/use-analytics-dashboard";

interface AnalyticsClientViewProps {
	userId: string;
	/** Server-side fetched profile data to ensure instant UI hydration and zero CLS. */
	initialProfile: UserProfile | null;
}

/**
 * The primary dashboard component for user progress and performance analysis.
 * * @description
 * This component acts as the "Visual Hub". Following the architectural refactor,
 * it no longer handles raw data processing. Instead, it delegates all state
 * management, filtering, and complex math to the `useAnalyticsDashboard` hook.
 * * **Architectural Pillars:**
 * 1. **Logic Separation**: The component is now a pure "View Orchestrator," making
 * the dashboard easier to test and maintain.
 * 2. **Contextual Filtering**: Displays data based on a global `year` state that
 * synchronizes all sub-sections (Heatmaps, Charts, PRs).
 * 3. **Hierarchical UI**: Uses a Radix-based Accordion to manage high information
 * density, specifically optimized for mobile-first "on-the-gym-floor" usage.
 * 4. **Hydration Strategy**: Leverages `initialProfile` to provide immediate
 * context for Personal Records before the client-side fetch completes.
 * * @param {AnalyticsClientViewProps} props - Component properties.
 * @returns {JSX.Element | null} The rendered dashboard or null during critical loading phases.
 */
export default function AnalyticsClientView({ userId, initialProfile }: AnalyticsClientViewProps) {
	/** * Analytics Engine Integration:
	 * Consumes the refined dashboard state. This hook centralizes:
	 * - Year filtering logic.
	 * - KPI memoization ($Volume = \sum w.volume$).
	 * - Multi-source data fetching (Workouts + Profile).
	 */
	const { year, setYear, stats, workouts, personalRecords, isLoading } = useAnalyticsDashboard(userId, initialProfile);

	/** * Render Guard:
	 * Prevents the UI from rendering in an inconsistent state during
	 * initial hydration if critical data is missing.
	 */
	if (isLoading || !workouts) return null;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* Analytics Control Bar:
                Fixed/Sticky header providing the year selection context.
            */}
			<AnalyticsHeader>
				<YearPicker year={year} onYearChange={setYear} />
			</AnalyticsHeader>
			<Separator />

			{/* Primary KPI Dashboard:
                Renders the four core metrics (Workouts, Duration, Sets, Volume).
            */}
			<SummarySection stats={stats} />

			<Separator />

			{/* Detailed Analytical Segments:
                Uses a collapsible Accordion to maintain a clean vertical rhythm.
            */}
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
						<RecordsSection records={personalRecords} year={year} />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
