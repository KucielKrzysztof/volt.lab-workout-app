/**
 * @fileoverview Headless hook for managing the Feedback Form state and submission lifecycle.
 * Orchestrates the transition of user reports and diagnostic snapshots to the server,
 * while strictly adhering to the VOLT.LAB Privacy Protocol.
 * @module features/help/hooks/useFeedbackForm
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { feedbackSchema, FeedbackFormValues } from "../schemas/feedback-schema";
import { submitFeedbackAction } from "../api/submit-feedback";
import { useTheme } from "next-themes";
import { UAParser } from "ua-parser-js";

/**
 * useFeedbackForm Hook.
 * * @description
 * Initializes a React Hook Form instance with Zod validation. It implements
 * a "Conditional Sniffer" logic that only bundles technical metadata if the
 * user has authorized supplemental protocols via the Privacy Uplink.
 * * @returns {Object}
 * - `form`: The react-hook-form instance.
 * - `isPending`: Boolean state for submission lifecycle tracking.
 * - `onSubmit`: The submission handler wrapped in form.handleSubmit.
 */
export const useFeedbackForm = () => {
	const { theme } = useTheme();
	/** @type {[boolean, function]} Internal state tracking the uplink progress. */
	const [isPending, setIsPending] = useState(false);

	/** @type {import("react-hook-form").UseFormReturn<FeedbackFormValues>} Form orchestrator. */
	const form = useForm<FeedbackFormValues>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			category: "other",
			title: "",
			description: "",
		},
	});

	/**
	 * Environment Sniffer.
	 * Captures a diagnostic snapshot of the user's current environment.
	 * * @security_note
	 * This function checks for the 'cookieConsent=true' string in document.cookie.
	 * If missing, it aborts the capture and returns a restricted payload.
	 * * @returns {Object} Technical metadata or restricted protocol status.
	 */
	const captureMetadata = () => {
		if (typeof window === "undefined") return {};

		// 1. Check for the specific cookie consent status
		const hasConsent = document.cookie.includes("cookieConsent=true");

		// 2. If NO consent, return only restricted, strictly necessary metadata
		if (!hasConsent) {
			return {
				protocol_status: "RESTRICTED",
				timestamp: new Date().toISOString(),
				note: "User declined supplemental tracking. Diagnostic capture aborted.",
			};
		}

		// 3. If AUTHORIZED, execute full diagnostic uplink
		const parser = new UAParser();
		const result = parser.getResult();
		const nav = navigator as any;

		return {
			browser: `${result.browser.name} ${result.browser.version}`,
			os: `${result.os.name} ${result.os.version}`,
			device: result.device.model || "Desktop",
			deviceType: result.device.type || "pc",
			cookiesEnabled: nav.cookieEnabled,
			language: nav.language,
			resolution: `${window.screen.width}x${window.screen.height}`,
			viewport: `${window.innerWidth}x${window.innerHeight}`,
			pixelRatio: window.devicePixelRatio,

			network: nav.connection?.effectiveType || "unsupported",
			theme: theme || "unspecified",

			timestamp: new Date().toISOString(),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		};
	};

	/**
	 * Internal handler for processing validated form data.
	 * Merges user input with the diagnostic payload and executes the Server Action.
	 * * @param {FeedbackFormValues} values - Validated data from form fields.
	 */
	const onSubmit = async (values: FeedbackFormValues) => {
		setIsPending(true);

		try {
			// Merging manual input with auto-captured metadata
			const enrichedData = {
				...values,
				browserMetadata: captureMetadata(),
			};
			// Execution of the secure Server Action
			const result = await submitFeedbackAction(enrichedData);

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
