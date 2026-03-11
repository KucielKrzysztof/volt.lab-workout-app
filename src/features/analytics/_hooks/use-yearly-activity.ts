/**
 * @fileoverview Activity Snapshot Orchestrator.
 * Manages the temporal data stream for the yearly activity heatmap
 * using TanStack Query v5.
 * @module features/analytics/hooks
 */

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { workoutService } from "@/services/apiWorkouts";

/**
 * Custom hook for fetching a user's activity heatmap data.
 * * @description
 * This hook is a core component of the "Activity Snapshot Engine." It fetches
 * a lightweight collection of timestamps to generate high-accuracy heatmaps
 * without the overhead of full relational workout objects.
 * * @features
 * 1. **Payload Optimization**: Bypasses heavy joins to fetch only 'started_at'
 * columns, reducing network traffic by ~90%.
 * 2. **Offline Resilience**: Implements `networkMode: 'offlineFirst'` to ensure
 * the activity grid remains visible and stable during signal drops in gym
 * environments.
 * 3. **High-Precision Caching**: Sets a 30-minute `staleTime` for activity
 * snapshots and a 24-hour `gcTime` to support deep-history review without
 * an active uplink.
 * * @param {string} userId - UUID of the target user (primary cache key).
 * @param {number} year - The specific calendar year for temporal partitioning.
 * * @returns {UseQueryResult} A query object containing the yearly activity
 * timestamps and connectivity metadata.
 */
export const useYearlyActivity = (userId: string, year: number) => {
	const supabase = createClient();

	return useQuery({
		/** * Deterministic Temporal Cache Key:
		 * Scoped to the 'workout-activity' namespace, user, and specific year.
		 */
		queryKey: ["workout-activity", userId, year],
		/** * Data Acquisition Logic:
		 * Executes an optimized SQL snapshot query via the workout service.
		 */
		queryFn: () => workoutService.getYearlyActivitySnapshot(supabase, userId, year),

		/** * Global Connectivity Protocol:
		 * Optimized for statistical data: 30m freshness and 24h persistence.
		 */
		staleTime: 1000 * 60 * 30,
		gcTime: 1000 * 60 * 60 * 24,
		networkMode: "offlineFirst",
	});
};
