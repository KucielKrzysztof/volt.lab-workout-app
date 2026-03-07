/**
 * @fileoverview Validation schema and type definitions for the Reporting System.
 * This schema ensures data integrity for feedback transmitted to the Help Service.
 */

import * as z from "zod";

/**
 * Zod validation schema for the Feedback Form.
 * Enforces strict rules for reporting system bugs, requesting features, or suggesting improvements.
 * * @example
 * const result = feedbackSchema.safeParse({
 * category: 'bug',
 * title: 'Data Sync Failure',
 * description: 'The workout history does not refresh after a session.'
 * });
 * * @property {('bug'|'feature'|'improvement'|'other')} category - The classification of the anomaly for database indexing.
 * @property {string} title - A concise subject line for the report (Min: 5, Max: 100 chars).
 * @property {string} description - In-depth technical details regarding the observed behavior (Min: 20 chars).
 */
export const feedbackSchema = z.object({
	/** Report category required for proper sorting and priority assignment in the backend. */
	category: z.enum(["bug", "feature", "improvement", "other"], {
		message: "SELECT A CATEGORY FOR CALIBRATION",
	}),
	/** The subject line used to identify the reported issue at a glance. */
	title: z.string().min(5, "TITLE MUST BE AT LEAST 5 CHARACTERS").max(100),
	/** Comprehensive details providing the necessary context for system debugging. */
	description: z.string().min(20, "DESCRIBE THE TOPIC IN DETAIL (MIN 20 CHARS)"),
});

/**
 * Derived TypeScript type inferred from the feedbackSchema.
 * Used across Server Actions, Hooks, and Agnostic Services to maintain type safety.
 */
export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
