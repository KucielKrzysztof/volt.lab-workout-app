/**
 * @fileoverview Main entry point for the Laboratory Calculators route.
 * This server component establishes the page layout,
 * serving as the host for the dynamic calculation orchestrator.
 * @module app/calculators/page
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { CalculatorsClientView } from "@/features/calculators/components/CalculatorsClientView";
import { Calculator } from "lucide-react";

/**
 * Platform Metadata.
 * Defines the identity of the Calculators module.
 */
export const metadata = {
	title: "CALCULATORS | VOLT.LAB",
	description: "Training intensity and strength metrics calibration.",
};

/**
 * CalculatorsPage Component.
 * * @description
 * The primary workspace for training analytics. It utilizes a Server Component
 * to render the persistent header and delegates all reactive state management
 * to the `CalculatorsClientView`.
 * * @returns {JSX.Element} The orchestrated Calculators UI.
 */
export default function CalculatorsPage() {
	return (
		<main className="container mx-auto px-4 pb-10">
			{/* Visual Uplink Header: 
                Configured with the 'Calculator' icon to match the navigation system. 
            */}
			<PageHeader title="CALCULATORS" icon={<Calculator size={28} strokeWidth={2.5} />} subtitle="High-precision tools for training calibration." />

			{/* Interactive Orchestrator:
                Handles the dynamic switching between 1RM, Wilks, and RPE protocols.
            */}
			<CalculatorsClientView />
		</main>
	);
}
