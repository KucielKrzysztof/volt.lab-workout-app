/**
 * @fileoverview Terms of Service (TOS) View.
 * Displays the legal framework and operational rules of the VOLT.LAB workstation.
 * @module features/privacy/components/TOSClientView
 */

"use client";

import { ShieldAlert, Zap, Scale, HeartPulse, HardDrive } from "lucide-react";

/**
 * TOSClientView Component.
 * * @description
 * Provides a high-density, legally calibrated interface for the Terms of Service.
 * Covers liability, health disclaimers, and data ownership.
 * * @returns {JSX.Element} The rendered legal and operational protocol.
 */
export const TOSClientView = () => {
	/** * @constant {Array<Object>} sections
	 * Structured data for the legal framework, ensuring easy future calibration.
	 */
	const sections = [
		{
			title: "1. Nature of Service",
			icon: <Zap size={18} className="text-primary" />,
			content:
				"VOLT.LAB is a digital tool for tracking athletic performance and training volume. It is provided on an 'as-is' and 'as-available' basis. We do not provide professional training plans or medical advice. Your use of the workstation is entirely voluntary and at your own risk. The application is a pure data-logging workstation for individual use.",
		},
		{
			title: "2. Health & Safety Protocol",
			icon: <HeartPulse size={18} className="text-primary" />,
			content:
				"By initializing a session, you certify that you possess the full legal capacity to enter into this agreement and are in adequate physical health to undertake strenuous exercise. You acknowledge that training involves inherent risks of injury. To the maximum extent permitted by law, VOLT.LAB and its creator are not liable for any physical injuries, health complications, or damages resulting from the use of the system.",
		},
		{
			title: "3. Intellectual Property & Code",
			icon: <Scale size={18} className="text-primary" />,
			content:
				"Users are granted a limited, non-exclusive license to use the interface. Any attempt at reverse-engineering, unauthorized scraping, or bypassing the Security Proxy is a violation of this protocol and may result in immediate access termination.",
		},
		{
			title: "4. Data Ownership & Integrity",
			icon: <HardDrive size={18} className="text-primary" />,
			content:
				"In accordance with GDPR (RODO), you retain ownership of your data and the right to its erasure. While we provide high-performance synchronization via Supabase, we do not guarantee 100% uptime,  we do not guarantee against data loss caused by hardware failure, connection anomalies, or third-party service disruptions. In accordance with GDPR (RODO), you have the right to access and request deletion of your data. We are not responsible for data loss caused by user-side terminal failures or connection anomalies.",
		},
		{
			title: "5. Termination of Access",
			icon: <ShieldAlert size={18} className="text-primary" />,
			content:
				"We reserve the right to decommission any account found in violation of these protocols, including attempting to disrupt the system's stability.  All  legal disputes shall be governed by the laws of Poland and the EU. We reserve the right to update these protocols at any time; continued use of the workstation constitutes acceptance of the new calibration.",
		},
	];

	return (
		<div className="grid gap-6 py-4">
			{sections.map((section, idx) => (
				<section key={idx} className="p-6 border border-primary/5 bg-primary/[0.02] rounded-lg space-y-3">
					<div className="flex items-center gap-3">
						{section.icon}
						<h2 className="font-bold uppercase tracking-tight italic">{section.title}</h2>
					</div>
					<p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
				</section>
			))}
		</div>
	);
};
