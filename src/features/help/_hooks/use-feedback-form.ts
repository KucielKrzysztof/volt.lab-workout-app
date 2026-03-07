/**
 * @fileoverview Headless hook for managing the Feedback Form state and submission lifecycle.
 * Decouples form logic from UI components to enhance maintainability.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { feedbackSchema, FeedbackFormValues } from "../schemas/feedback-schema";
import { submitFeedbackAction } from "../api/submit-feedback";

/**
 * useFeedbackForm
 * * * A specialized hook that initializes a React Hook Form instance with Zod validation
 * and handles the asynchronous transition of data to the server.
 * * **Functionality**:
 * 1. Initializes form with default values and Zod resolver.
 * 2. Manages the 'isPending' state during the Server Action execution.
 * 3. Provides a pre-configured 'onSubmit' handler that manages toasts and form resets.
 * * @returns {Object} An object containing:
 * - `form`: The react-hook-form instance for binding to UI fields.
 * - `isPending`: Boolean state indicating if a submission is currently in progress.
 * - `onSubmit`: The submission handler wrapped in form.handleSubmit.
 */
export const useFeedbackForm = () => {
	/** @type {[boolean, function]} Internal state tracking the uplink progress. */
	const [isPending, setIsPending] = useState(false);

	/** @type {import("react-hook-form").UseFormReturn<FeedbackFormValues>} Form orchestrator. */
	const form = useForm<FeedbackFormValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	/**
	 * Internal handler for processing validated form data.
	 * * @param {FeedbackFormValues} values - Validated data from the form fields.
	 */
	const onSubmit = async (values: FeedbackFormValues) => {
		setIsPending(true);

		try {
			// Execution of the secure Server Action
			const result = await submitFeedbackAction(values);

			if (result.error) {
				toast.error(result.error);
			} else if (result.success) {
				// Notifies the user of successful calibration and clears the form
				toast.success("REPORT CREATED. CALIBRATION IN PROGRESS.");
				form.reset({
					category: undefined,
					title: "",
					description: "",
				});
			}
		} catch (error) {
			// Fallback for network failures or unhandled server anomalies
			toast.error("UPLINK CRITICAL ERROR: Action failed.");
		} finally {
			setIsPending(false);
		}
	};

	return {
		form,
		isPending,
		onSubmit: form.handleSubmit(onSubmit),
	};
};
