/**
 * @fileoverview Analytics Engine Hook.
 * Orchestrates data aggregation, year-based filtering, and KPI calculations
 * for the analytics dashboard.
 */

import { useState, useMemo } from "react";
import { useProfile } from "@/features/profile/_hooks/use-profile";
import { useWorkouts } from "@/features/workouts/_hooks/use-workouts";
import { formatDuration, formatVolume } from "@/lib/formatter";
import { UserProfile } from "@/types/profile";

/**
 * Custom hook to manage the business logic of the Analytics Dashboard.
 * * **Logic Flow:**
 * 1. Fetches raw profile & workout data.
 * 2. Filters workouts based on the selected year.
 * 3. Aggregates totals (Volume, Duration, Sets).
 * 4. Formats data for UI consumption.
 */
export const useAnalyticsDashboard = (userId: string, initialProfile: UserProfile | null) => {
	/** Local state for year-based filtering across all analytics modules. */
	const [year, setYear] = useState(new Date().getFullYear());

	/** * Profile Data Synchronization:
	 * Ensures that PR updates from the settings or training flow are reflected
	 * in the analytics view in real-time.
	 */
	const { profile } = useProfile(userId, initialProfile);

	/** * Workout History Acquisition:
	 * Fetches the user's full history. The component handles the filtering
	 * locally to allow for instant year-switching without new network requests.
	 */
	const { data: workouts, isLoading } = useWorkouts(userId);

	/**
	 * Memoized calculation of high-level training KPIs.
	 * * @description
	 * This block executes every time the `year` or `workouts` list changes.
	 * It filters sessions based on the `displayDate` string and reduces them
	 * into cumulative totals for volume, duration, and sets.
	 */
	const stats = useMemo(() => {
		const defaultStats = {
			workouts: 0,
			duration: "0:00:00",
			sets: 0,
			volume: "0 kg",
		};

		if (!workouts) return defaultStats;

		// Filtering logic using the localized displayDate string
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

	return {
		year,
		setYear,
		stats,
		profile,
		workouts,
		isLoading: isLoading || !workouts,
		personalRecords: profile?.personal_records || [],
	};
};
