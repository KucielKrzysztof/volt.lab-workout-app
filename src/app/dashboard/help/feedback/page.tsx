/**
 * @fileoverview Entry point for the Feedback and Bug Report interface.
 * This Server Component initializes the view layer for the Help & Support module.
 */

import FeedbackClientView from "@/features/help/components/feedback/FeedbackClientView";

/**
 * FeedbackAndBugReportPage Component.
 * * Serves as the primary routing node for user-initiated reports and feature requests.
 * By utilizing the FeedbackClientView, this page leverages Client-Side Rendering (CSR) for an interactive
 * form experience while maintaining the App Router's server-first structure.
 * * @returns {JSX.Element} The rendered Feedback module interface.
 */
export default function FeedbackAndBugReportPage() {
	return <FeedbackClientView />;
}
