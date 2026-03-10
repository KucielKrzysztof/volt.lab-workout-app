/**
 * @fileoverview Privacy Protocol and Data Governance disclosure page.
 * This view provides high-level transparency regarding core infrastructure
 * and voluntary diagnostic telemetry captured within the VOLT.LAB ecosystem.
 * @module app/privacy/page
 */

import { PrivacyClientView } from "@/features/privacy/components/PrivacyClientView";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * PrivacyPage Component.
 * * @description
 * The primary transparency hub for the application. It outlines the technical
 * necessity of specific data strings (Auth/Theme) and provides an interface
 * for managing supplemental diagnostic consent.
 * * @security_note
 * This route is configured as a public exception in the Middleware Proxy,
 * allowing unauthenticated users to review legal protocols prior to session initialization.
 * * @section 01 - Core Infrastructure: Covers strictly necessary cookies (Supabase & Theme).
 * @section 02 - Diagnostic Sniffer: Lists optional telemetry captured via `useFeedbackForm`.
 * * @returns {JSX.Element} The orchestrated Privacy Protocol view.
 */
export default function PrivacyPage() {
	/** @constant {string[]} snifferFields - Granular list of telemetry captured during diagnostic events. */
	const snifferFields = [
		"Browser Identity",
		"OS & System Version",
		"Device Model",
		"Display Resolution",
		"Viewport Context",
		"DPI / Pixel Ratio",
		"Network Protocol",
		"Timezone & Clock",
		"Cookie Authorization",
		"System Language",
		"App Theme",
	];

	return (
		<main className="min-h-screen bg-background pb-20 pt-10 px-4">
			<ShieldCheck size={40} strokeWidth={2.5} className="mx-auto" />
			<div className="max-w-3xl mx-auto space-y-12">
				<PageHeader title="Privacy" subtitle="Version 1.0.0 | Last Calibration: 10.03.2026" />

				{/* Interactive Governance Panel: Handles client-side cookie logic */}
				<PrivacyClientView />

				{/* Content Sections */}
				<section className="space-y-8 text-sm leading-relaxed">
					{/*NECESSARY PROTOCOLS */}
					<div className="space-y-4">
						<h2 className="text-xl font-black uppercase italic border-b border-primary/20 pb-2">01. Core Infrastructure (Necessary)</h2>
						<p>
							VOLT.LAB requires specific data strings to maintain system stability. These are classified as{" "}
							<span className="text-primary font-bold">Strictly Necessary</span> and cannot be disabled:
						</p>
						<ul className="list-disc pl-5 space-y-2 text-muted-foreground">
							<li>
								<span className="text-foreground font-semibold">Authentication:</span> Secure session tokens via Supabase to protect your training
								records.
							</li>
							<li>
								<span className="text-foreground font-semibold">Interface Sync:</span> Cookie-based theme persistence for the Midnight/Light visual
								engine.
							</li>
						</ul>
					</div>

					{/* VOLUNTARY TELEMETRY */}
					<div className="space-y-4">
						<h2 className="text-xl font-black uppercase italic border-b border-primary/20 pb-2">02. Diagnostic Sniffer (Voluntary)</h2>
						<p>
							If the <span className="text-primary font-bold">DATA CONSENT</span> above is authorized, the system prepares a technical payload during
							feedback submission. This data is critical for debugging device-specific rendering anomalies:
						</p>

						<div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-4">
							{snifferFields.map((item) => (
								<div
									key={item}
									className="bg-secondary/20 p-2 border border-primary/10 text-[9px] md:text-[10px] uppercase font-black italic text-center tracking-tighter"
								>
									{item}
								</div>
							))}
						</div>

						{/* TRANSMISSION PROTOCOL ALERT */}
						<div className="bg-primary/5 border-l-2 border-primary/30 p-4 space-y-2">
							<p className="text-xs font-bold uppercase italic tracking-widest text-primary">Transmission Protocol:</p>
							<p className="text-[11px] text-muted-foreground leading-relaxed">
								This telemetry is <span className="text-foreground font-bold italic underline">NOT</span> collected in the background. The sniffer
								only activates at the precise millisecond of a manual feedback submission. If your DATA CONSENT is Restricted or cookies are disabled
								via browser settings, this payload is automatically aborted.
							</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
