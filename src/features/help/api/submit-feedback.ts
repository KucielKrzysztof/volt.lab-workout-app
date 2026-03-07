/**
 * @fileoverview Server Action for secure feedback submission.
 * Orchestrates the transition from the client-side UI to the database layer
 * using the standardized VOLT.LAB "Trinity" pattern.
 */

"use server";

import { createClient } from "@/core/supabase/server";
import { feedbackService } from "@/services/apiFeedback";
import { feedbackSchema, FeedbackFormValues } from "../schemas/feedback-schema";
import { revalidatePath } from "next/cache";

/**
 * submitFeedbackAction
 * * A secure Server Action that processes user feedback reports. It performs
 * identity verification, data validation, and persists the entry via the
 * feedbackService.
 * * **Pattern Workflow**:
 * 1. Initialize Server-side Supabase client.
 * 2. Verify active user session (Auth Guard).
 * 3. Validate payload against the Zod schema.
 * 4. Delegate database insertion to the agnostic service layer.
 * 5. Revalidate cache to reflect changes.
 * * @param {FeedbackFormValues} values - The raw form data transmitted from the client.
 * @returns {Promise<{ success?: boolean; error?: string }>} An object indicating operational success or a specific failure message.
 */
export async function submitFeedbackAction(values: FeedbackFormValues) {
	const supabase = await createClient();

	// 1. Auth Check - Ensure the request originates from an authenticated session
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		console.error("AUTH_ERROR_SERVER_ACTION:", authError);
		return { error: "UNAUTHORIZED: Session expired or invalid." };
	}

	// 2. Server-side Validation - Prevent schema mismatch during uplink
	const validatedFields = feedbackSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "INVALID DATA: Schema mismatch detected during uplink." };
	}

	try {
		// 3. Delegation to Agnostic Service - Perform the database insert
		await feedbackService.submitFeedback(supabase, user.id, validatedFields.data);

		// 4. Cache Invalidation - Ensure the feedback view is updated
		revalidatePath("/dashboard/help/feedback");
		return { success: true };
	} catch (error) {
		console.error("DEBUG VOLT.LAB ERROR:", error);
		return { error: "SYSTEM ANOMALY: Failed to commit feedback to database." };
	}
}
