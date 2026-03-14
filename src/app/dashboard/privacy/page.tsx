/**
 * @fileoverview Public Disclosure Engine for Laboratory Protocols and Governance.
 * This server-side container orchestrates the transparency layer, providing
 * unauthenticated access to Privacy Policy and Terms of Service.
 * @module app/privacy/page
 */

import { GovernanceHub } from "@/features/privacy/components/GovernanceHub";
import { ShieldCheck } from "lucide-react";

/**
 * PrivacyPage Component.
 * * @description
 * Acts as the primary "Governance Hub" for the VOLT.LAB ecosystem. It serves
 * as a high-density transparency container that manages the hand-off between
 * server-side legal requirements and client-side diagnostic consent.
 * * @security_note
 * CRITICAL: This route is explicitly white-listed in the Middleware Proxy (`src/proxy.ts`).
 * It must remain accessible to unauthenticated traffic to satisfy global
 * transparency standards prior to user onboarding.
 * **Governance Orchestration**: Mounts the `GovernanceHub` to handle tabbed protocol switching.
 * * @returns {JSX.Element} The orchestrated Governance and Privacy view.
 */
export default function PrivacyPage() {
	return (
		<main className="min-h-screen bg-background pb-20 pt-10 px-4">
			<ShieldCheck size={40} strokeWidth={2.5} className="mx-auto text-primary mb-6" />

			{/* Interactive Protocol Hub: Unified Privacy & TOS interface */}
			<GovernanceHub />

			{/* Static Compliance Footer */}
			<footer className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.3em] pt-12 max-w-3xl mx-auto border-t border-primary/5 mt-10">
				VOLT.LAB // SYSTEM GOVERNANCE // {new Date().getUTCFullYear()}
			</footer>
		</main>
	);
}
