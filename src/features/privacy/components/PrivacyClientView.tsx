/**
 * @fileoverview Interactive interface for the VOLT.LAB Privacy Protocol.
 * Orchestrates the user-facing control panel for diagnostic consent,
 * telemetry management, and data governance transparency.
 * @module features/privacy/components/PrivacyClientView
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCookieConsent } from "../_hooks/useCookieConsent";

/**
 * PrivacyClientView Component.
 * * @description
 * An interactive data consent card that allows users to toggle the collection
 * of supplemental diagnostic data (the "Sniffer"). It visually communicates
 * the current authorization state and explains the technical implications
 * of the user's choice.
 * * @logic_flow
 * 1. **SSR Hydration Guard**: Implements a null-return strategy to prevent
 * client/server mismatches while resolving browser-stored consent tokens.
 * 2. Consumes `useCookieConsent` to access global protocol status.
 * 3. Explains the direct link between cookie acceptance and metadata capture.
 * * @security_note
 * This component handles sensitive consent tokens stored in the browser.
 * The "Sniffer" logic is hard-coded to remain dormant unless an explicit
 * 'Authorized' state is confirmed via the `cookieConsent` token.
 * * @returns {JSX.Element | null} The interactive privacy card or null during hydration.
 */
export const PrivacyClientView = () => {
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

	/** * @type {Object} consentLogic - Destructured from the headless governance hook.
	 * @property {boolean | null} consent - Current state of the 'cookieConsent' protocol.
	 * @property {function} toggleConsent - Method to update the protocol status with root-scoping.
	 */
	const { consent, toggleConsent } = useCookieConsent();

	/** * Hydration Guard:
	 * Prevents SSR mismatch by ensuring the component only renders once
	 * the browser's cookie state has been resolved.
	 */
	if (consent === null) return null;

	return (
		<div className="space-y-12">
			<Card className="border-primary/20 bg-secondary/10 overflow-hidden">
				<div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
					<span className="text-xs font-black uppercase tracking-widest italic">DATA CONSENT</span>
					<Badge variant={consent ? "default" : "destructive"} className="uppercase  text-[10px]">
						{consent ? "Authorized" : "Restricted"}
					</Badge>
				</div>
				<CardContent className="p-6 space-y-6">
					<div className="flex items-start gap-4">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground leading-relaxed">
								{consent
									? "Supplemental diagnostics authorized. High-fidelity environment snapshots (OS version, Device type, screen resolution, network type, etc...) are bundled ONLY when you manually submit a Calibration Report and PROVIDED that Cookie Protocols remain accepted. If cookies are restricted via browser settings, no metadata will be captured."
									: "Diagnostic tracking is restricted. Metadata sniffer will remain inactive during feedback submission. Only strictly necessary data (Auth session & Theme) is processed to maintain system integrity. Your reports will lack technical context regardless of submission type."}
							</p>
						</div>
					</div>
					<Button
						variant={consent ? "destructive" : "default"}
						onClick={() => toggleConsent(!consent)}
						className="w-full uppercase font-bold italic tracking-widest py-6"
					>
						{consent ? "Revoke Consent" : "Authorize Protocols"}
					</Button>
				</CardContent>
			</Card>
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
							This telemetry is <span className="text-foreground font-bold italic underline">NOT</span> collected in the background. The sniffer only
							activates at the precise millisecond of a manual feedback submission. If your DATA CONSENT is Restricted or cookies are disabled via
							browser settings, this payload is automatically aborted.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};
