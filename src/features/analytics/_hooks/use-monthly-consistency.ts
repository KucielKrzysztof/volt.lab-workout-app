/**
 * @fileoverview Monthly Consistency Orchestrator.
 * Transforms raw workout timestamps into structured frequency data for bar charts.
 * @module features/analytics/hooks
 */

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { analyticsService } from "@/services/apiAnalytics";
import { MonthlyFrequency } from "../components/charts/ActivityFrequencyChart";

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/**
 * Custom hook for fetching and processing workout frequency per month.
 * * @description
 * 1. **Data Acquisition**: Fetches raw timestamps from the Analytics Service.
 * 2. **Transformation**: Reduces ISO strings into a frequency map aligned with 'MonthlyFrequency'.
 * 3. **Caching**: Implements a 30m staleTime and offline resilience.
 * * @param {string} userId - UUID of the athlete.
 * @param {number} year - Target calendar year.
 */
export const useMonthlyConsistency = (userId: string, year: number) => {
	const supabase = createClient();

	return useQuery({
		queryKey: ["monthly-consistency", userId, year],
		queryFn: () => {
			if (!userId) throw new Error("User ID is required for analytics");
			return analyticsService.getYearlyWorkoutTimestamps(supabase, userId, year);
		},
		enabled: !!userId,
		select: (timestamps): MonthlyFrequency[] => {
			/** * Data Transformation Engine:
			 * Initializes a 12-month map and increments counts based on the timestamp month index.
			 */
			const frequencyMap = MONTH_LABELS.map((month) => ({ month, count: 0 }));

			timestamps.forEach((ts) => {
				const monthIndex = new Date(ts).getUTCMonth();
				if (frequencyMap[monthIndex]) {
					frequencyMap[monthIndex].count += 1;
				}
			});

			return frequencyMap;
		},
		staleTime: 1000 * 60 * 30, // 30 minutes
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		networkMode: "offlineFirst",
	});
};
