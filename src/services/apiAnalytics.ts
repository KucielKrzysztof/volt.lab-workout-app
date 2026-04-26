/**
 * @fileoverview Analytical data service for VOLT.LAB.
 * Orchestrates specialized queries for data visualization and trend analysis.
 * @module services/apiAnalytics
 */

import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service object containing methods for high-level athletic data aggregation.
 */
export const analyticsService = {
	/**
	 * Fetches a lightweight collection of workout start times for analytical grouping.
	 * * @description
	 * Optimized for temporal charts. By sniping only the 'started_at' column,
	 * we minimize the data transfer overhead compared to relational workout models.
	 * * @param {SupabaseClient} supabase - Authenticated client instance.
	 * @param {string} userId - UUID of the target athlete.
	 * @param {number} year - The specific calendar year to query.
	 * @returns {Promise<string[]>} An array of ISO 8601 timestamp strings.
	 */
	getYearlyWorkoutTimestamps: async (supabase: SupabaseClient, userId: string, year: number): Promise<string[]> => {
		const startOfYear = `${year}-01-01T00:00:00Z`;
		const endOfYear = `${year}-12-31T23:59:59Z`;

		const { data, error } = await supabase
			.from("workouts")
			.select("started_at")
			.eq("user_id", userId)
			.gte("started_at", startOfYear)
			.lte("started_at", endOfYear)
			.order("started_at", { ascending: true });

		if (error) throw new Error(error.message);

		return (data || []).map((w) => w.started_at);
	},
};
