/**
 * @fileoverview Interactive interface for the VOLT.LAB Privacy Protocol.
 * Provides the user with a transparent control panel to manage diagnostic
 * consent and supplemental tracking status.
 * @module features/privacy/components/PrivacyClientView
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCookieConsent } from "../_hooks/useCookieConsent";

/**
 * PrivacyClientView Component.
 * * @description
 * An interactive governance card that allows users to toggle the collection
 * of supplemental diagnostic data (the "Sniffer"). It visually communicates
 * the current authorization state and explains the technical implications
 * of the user's choice.
 * * Logic flow:
 * 1. Consumes `useCookieConsent` to access global protocol status.
 * 2. Provides immediate visual feedback through status badges and icons.
 * 3. Explains the direct link between cookie acceptance and metadata capture.
 * * @security_note
 * This component handles strictly client-side logic regarding browser-stored
 * consent tokens. It implements an SSR guard by returning null when the
 * consent state is uninitialized.
 * * @returns {JSX.Element | null} The interactive privacy card or null during hydration.
 */
export const PrivacyClientView = () => {
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
		<Card className="border-primary/20 bg-secondary/10 overflow-hidden">
			<div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
				<span className="text-xs font-black uppercase tracking-widest italic">DATA CONSENT</span>
				<Badge variant={consent ? "default" : "destructive"} className="uppercase  text-[10px]">
					{consent ? "Authorized" : "Restricted"}
				</Badge>
			</div>
			<CardContent className="p-6 space-y-6">
				<div className="flex items-start gap-4">
					{consent ? <CheckCircle2 className="text-primary mt-1" size={32} /> : <XCircle className="text-destructive mt-1" size={32} />}
					<div className="space-y-1">
						<p className="font-bold uppercase italic text-sm">Current Consent Status</p>
						<p className="text-xs text-muted-foreground leading-relaxed">
							{consent
								? "Supplemental diagnostics authorized. High-fidelity environment snapshots (OS version, Device type, screen resolution, network type, etc...) are bundled ONLY when you manually submit a Calibration Report and PROVIDED that Cookie Protocols remain accepted. If cookies are restricted via browser settings, no metadata will be captured."
								: "Diagnostic tracking is restricted. Metadata sniffer will remain inactive during feedback submission. Only strictly necessary data (Auth session & Theme) is processed to maintain system integrity. Your reports will lack technical context regardless of submission type."}
						</p>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 pt-2">
					{!consent ? (
						<Button onClick={() => toggleConsent(true)} className="flex-1 uppercase font-bold italic tracking-widest py-6">
							Authorize Protocols
						</Button>
					) : (
						<Button variant="destructive" onClick={() => toggleConsent(false)} className="flex-1 uppercase font-bold italic tracking-widest py-6">
							Revoke Consent
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
