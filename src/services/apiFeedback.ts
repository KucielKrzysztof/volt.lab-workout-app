/**
 * @fileoverview Service layer for feedback-related database operations.
 * Implements the agnostic "Engine Injection" pattern for consistent data
 * processing across Server and Client contexts.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { FeedbackFormValues } from "@/features/help/schemas/feedback-schema";

/**
 * feedbackService
 * * A collection of stateless methods for managing system anomaly reports
 * and user-submitted feature requests.
 */
export const feedbackService = {
	/**
	 * Persists a new feedback record to the 'feedback_reports' table.
	 * * * @param {SupabaseClient} supabase - The injected Supabase engine (Server or Client).
	 * @param {string} userId - The unique identifier of the reporting user (UUID).
	 * @param {FeedbackFormValues} values - The validated calibration data from the form.
	 * * @returns {Promise<any>} A promise resolving to the newly created database record.
	 * * @throws {Error} If the database uplink fails or RLS policies are violated.
	 * * @example
	 * await feedbackService.submitFeedback(supabase, user.id, {
	 * category: 'bug',
	 * title: '...',
	 * description: '...'
	 * });
	 */
	async submitFeedback(supabase: SupabaseClient, userId: string, values: FeedbackFormValues) {
		const { data, error } = await supabase
			.from("feedback_reports")
			.insert({
				user_id: userId,
				category: values.category,
				title: values.title,
				description: values.description,
				status: "open",
				browser_metadata: values.browserMetadata,
			})
			.select()
			.single();

		if (error) {
			console.error("SUPABASE_SERVICE_ERROR:", error);
			throw new Error(error.message);
		}

		return data;
	},
};
