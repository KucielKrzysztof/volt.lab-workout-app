/**
 * @fileoverview Navigation hub for system documentation and user feedback.
 * Orchestrates the entry points for the Laboratory Manual, FAQ, and Bug Reporting.
 * @module features/support/components
 */

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { SystemStatus } from "./SystemStatus";
import { HelpNavigation } from "./HelpNavigation";

/**
 * HelpClientView Component.
 * * @description
 * Provides a structured, high-contrast list of support resources.
 */
export default function HelpClientView() {
	return (
		<div className="flex flex-col min-h-screen pb-20">
			<PageHeader title="Support" subtitle="Laboratory Assistance" className="mb-6" />

			<main className="px-4 space-y-3">
				{/* System Status Indicator - as proposed in TODO */}
				<SystemStatus />

				{/* Navigation Menu */}
				<HelpNavigation />
			</main>
		</div>
	);
}
