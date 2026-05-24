/**
 * @fileoverview Advanced Analytics Data Access Object.
 * Handles high-density queries for exercise progression, temporal consistency, and muscular balance.
 * @module services/apiMoreAnalytics
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { MonthlyFrequency } from "@/features/analytics/components/charts/ActivityFrequencyChart";

/**
 * @interface RawProgressionSet
 * @description Database response contract for exercise-specific progression sets.
 */
interface RawProgressionSet {
	weight: number;
	reps: number;
	workouts: {
		started_at: string;
	};
}

/**
 * @interface SetMechanics
 * @description Represents the physical parameters of a single performed set.
 */
export interface SetMechanics {
	weight: number;
	reps: number;
}

/**
 * @interface TransformedProgression
 * @description Formatted data point optimized for the ProgressionLineChart.
 * Now includes granular set breakdown for advanced tooltip diagnostics.
 */
export interface TransformedProgression {
	date: string;
	volume: number;
	setsCount: number;
	setsBreakdown: SetMechanics[];
}

/**
 * @interface RadarDistribution
 * @description Formatted data point optimized for the MuscleRadarChart.
 */
export interface RadarDistribution {
	subject: string;
	value: number;
}
/**
 * @interface RadarDistribution
 * @description Formatted data point optimized for the MuscleRadarChart.
 */
export interface RadarDistribution {
	subject: string;
	value: number;
}

export const moreAnalyticsService = {
	/**
	 * Fetches the historical progression of a specific exercise for a user.
	 * Maps raw sets into aggregated temporal checkpoints with granular breakdown.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} userId - Target athlete's UUID.
	 * @param {string} exerciseId - Target exercise UUID.
	 * @returns {Promise<TransformedProgression[]>} Sorted timeline of performance metrics.
	 */
	getExerciseProgression: async (supabase: SupabaseClient, userId: string, exerciseId: string): Promise<TransformedProgression[]> => {
		if (!exerciseId) return [];

		const { data, error } = await supabase
			.from("workout_sets")
			.select(
				`
				weight,
				reps,
				workouts!inner (
					started_at
				)
			`,
			)
			.eq("exercise_id", exerciseId)
			.eq("workouts.user_id", userId)
			.not("workouts.started_at", "is", null)
			.order("workouts(started_at)", { ascending: true });

		if (error) throw error;

		// Grouping flat sets by chronological date with detailed mechanics
		const groups: Record<string, { totalVolume: number; sets: SetMechanics[] }> = {};

		(data as unknown as RawProgressionSet[]).forEach((set) => {
			const dateKey = new Date(set.workouts.started_at).toLocaleDateString("pl-PL", {
				day: "2-digit",
				month: "2-digit",
			});

			const currentVolume = set.weight * set.reps;

			// Initialize the daily log if it doesn't exist
			if (!groups[dateKey]) {
				groups[dateKey] = { totalVolume: 0, sets: [] };
			}

			// Accumulate volume and record exact set parameters
			groups[dateKey].totalVolume += currentVolume;
			groups[dateKey].sets.push({ weight: set.weight, reps: set.reps });
		});

		// Transform the record dictionary into an ordered array
		return Object.entries(groups).map(([date, stats]) => ({
			date,
			volume: stats.totalVolume,
			setsCount: stats.sets.length,
			setsBreakdown: stats.sets,
		}));
	},

	/**
	 * Aggregates global training data for consistency and muscular balance charts.
	 * Fetches everything in a single optimized relational query to prevent database roundtrips.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client instance.
	 * @param {string} userId - Target athlete's UUID.
	 * @param {number} year - Filter calendar year.
	 * @returns {Promise<{ frequency: MonthlyFrequency[]; radar: RadarDistribution[] }>} Core analytics payload.
	 */
	getGlobalMetrics: async (
		supabase: SupabaseClient,
		userId: string,
		year: number,
	): Promise<{ frequency: MonthlyFrequency[]; radar: RadarDistribution[] }> => {
		// Calculate boundaries for the target year
		const startOfYear = `${year}-01-01T00:00:00Z`;
		const endOfYear = `${year}-12-31T23:59:59Z`;

		// Single relational fetch: Workouts -> Sets -> Exercises (Muscle Group Info)
		const { data, error } = await supabase
			.from("workouts")
			.select(
				`
                id,
                started_at,
                workout_sets (
                    id,
                    exercises (
                        muscle_group
                    )
                )
            `,
			)
			.eq("user_id", userId)
			.eq("status", "completed") // Only analyze finished protocols
			.gte("started_at", startOfYear)
			.lte("started_at", endOfYear);

		if (error) throw error;

		// --- 1. Process Monthly Consistency (Frequency Chart) ---
		const monthsShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		const frequencyMap: Record<string, number> = monthsShort.reduce((acc, month) => ({ ...acc, [month]: 0 }), {});

		// --- 2. Process Weekly Muscle Group Allocation (Radar Chart) ---
		const muscleGroupMap: Record<string, number> = {};

		// --- 3. Last 7 days ---
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		data.forEach((workout) => {
			if (!workout.started_at) return;
			const workoutDate = new Date(workout.started_at);

			// 1. Frequency aggregation (all year)
			const monthIndex = workoutDate.getMonth();
			const monthName = monthsShort[monthIndex];
			frequencyMap[monthName] += 1;

			// 2. Radar aggregation (last week)
			if (workoutDate >= sevenDaysAgo) {
				workout.workout_sets?.forEach((set: any) => {
					const groupName = set.exercises?.muscle_group?.toUpperCase();
					if (groupName) {
						muscleGroupMap[groupName] = (muscleGroupMap[groupName] || 0) + 1;
					}
				});
			}
		});

		const frequency: MonthlyFrequency[] = Object.entries(frequencyMap).map(([month, count]) => ({
			month,
			count,
		}));

		// Absolute Count
		const radar: RadarDistribution[] = Object.entries(muscleGroupMap).map(([subject, value]) => ({
			subject,
			value,
		}));

		return { frequency, radar };
	},
};
