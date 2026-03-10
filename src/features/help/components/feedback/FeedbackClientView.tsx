/**
 * @fileoverview Orchestrator for the Feedback and Bug Reporting user interface.
 * This component aggregates the visual header and the functional form within the Help module.
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { FeedbackForm } from "./FeedbackForm";
import { Info } from "lucide-react";
import Link from "next/link";

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

			{/* STATIC DIAGNOSTIC NOTE */}
			<div className="bg-secondary/10 border-l-2 border-primary/50 p-4 rounded-r-xl flex gap-3 items-start">
				<Info className="text-primary shrink-0 mt-0.5" size={18} />
				<div className="space-y-1">
					<p className="text-[11px] leading-relaxed text-muted-foreground">
						<span className="text-primary font-black uppercase italic tracking-tighter mr-1">Diagnostic Notice:</span>
						If Supplemental Protocols (Cookies) are authorized, your report will be bundled with environment metadata to accelerate anomaly
						calibration. Check your status in the
						<Link href="/dashboard/privacy" className="text-foreground underline ml-1 hover:text-primary transition-colors">
							Privacy Settings
						</Link>
						.
					</p>
				</div>
			</div>

			{/* Centralized form container for data calibration */}
			<div className="max-w-2xl mx-auto mt-6">
				<FeedbackForm />
			</div>
		</main>
	);
}
