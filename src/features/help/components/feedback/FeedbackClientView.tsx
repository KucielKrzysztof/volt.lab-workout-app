/**
 * @fileoverview Orchestrator for the Feedback and Bug Reporting user interface.
 * This component aggregates the visual header and the functional form within the Help module.
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { FeedbackForm } from "./FeedbackForm";

/**
 * FeedbackClientView Component.
 * * * Acts as the primary container for the feedback feature, ensuring a consistent layout
 * and hierarchy for reporting system anomalies.
 * * It coordinates the presentation of the `PageHeader` and the `FeedbackForm` component,
 * which handles the underlying Zod-validated logic and Server Action triggers.
 * * @returns {JSX.Element} The structured main view for feedback submission.
 */
export default function FeedbackClientView() {
	return (
		<main className="container mx-auto px-4 pb-10">
			{/* Standardized PageHeader for visual consistency across the dashboard */}
			<PageHeader title="FEEdback & bug report" />

			{/* Centralized form container for data calibration */}
			<div className="max-w-2xl mx-auto mt-6">
				<FeedbackForm />
			</div>
		</main>
	);
}
