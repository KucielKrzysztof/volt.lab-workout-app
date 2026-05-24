/**
 * @fileoverview TanStack Query hooks for advanced analytics data fetching.
 * Manages the cache lifecycle and synchronization of laboratory diagnostics.
 * @module features/analytics/_hooks/use-advanced-analytics
 */

import { useQuery } from "@tanstack/react-query";
import { moreAnalyticsService } from "@/services/apiMoreAnalytics";
import { createClient } from "@/core/supabase/client";

/**
 * Standardized query key factory for analytics cache management.
 */
export const analyticsKeys = {
	all: ["analytics"] as const,
	progression: (userId: string, exerciseId: string) => [...analyticsKeys.all, "progression", userId, exerciseId] as const,
	globalMetrics: (userId: string, year: number) => [...analyticsKeys.all, "global", userId, year] as const,
};

/**
 * Hook: Retrieves historical performance data for a specific exercise.
 * @param {string} userId - UUID of the authenticated user.
 * @param {string} [exerciseId] - Optional exercise UUID to filter the dataset.
 */
export const useExerciseProgression = (userId: string, exerciseId?: string) => {
	// SECURITY FIX: Instantiate Supabase client inside the hook's execution context
	// to prevent cross-request state pollution during Server-Side Rendering (SSR).
	const supabase = createClient();

	return useQuery({
		queryKey: analyticsKeys.progression(userId, exerciseId || ""),
		queryFn: async () => {
			if (!exerciseId) return [];
			return await moreAnalyticsService.getExerciseProgression(supabase, userId, exerciseId);
		},
		enabled: !!userId && !!exerciseId, // Prevents execution if no exercise is selected
		staleTime: 30 * 60 * 1000, // Cache data for 30 minutes
	});
};

/**
 * Hook: Retrieves aggregated global metrics (frequency and muscular distribution).
 * @param {string} userId - UUID of the authenticated user.
 * @param {number} year - The target calendar year for analysis.
 */
export const useGlobalMetrics = (userId: string, year: number) => {
	// SECURITY FIX: Isolate Supabase client instance.
	const supabase = createClient();

	return useQuery({
		queryKey: analyticsKeys.globalMetrics(userId, year),
		queryFn: async () => {
			return await moreAnalyticsService.getGlobalMetrics(supabase, userId, year);
		},
		enabled: !!userId && !!year,
		staleTime: 30 * 60 * 1000, // Cache data for 30 minutes
	});
};
