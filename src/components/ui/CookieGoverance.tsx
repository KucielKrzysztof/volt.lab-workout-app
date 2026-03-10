/**
 * @fileoverview Governance Layer for Cookie Compliance and Privacy Protocols.
 * This component orchestrates the client-side injection of the consent banner,
 * ensuring strict adherence to the VOLT.LAB data protection standards.
 * @module features/help/components/CookieGovernance
 */

"use client";

import { useState, useEffect } from "react";
import CookieConsent from "./cookie-consent";

/**
 * CookieGovernance Component.
 * * @description
 * Acts as a **Hydration Guard** for the Cookie Consent system.
 * Since cookie and localStorage access is restricted to the browser environment,
 * this component prevents Server-Side Rendering (SSR) mismatches by delaying
 * the mount until the client-side lifecycle is active.
 * * @example
 * // Implementation in RootLayout
 * <CookieGovernance />
 * * @returns {JSX.Element | null} The initialized consent banner or null during SSR/initial hydration.
 */
export const CookieGovernance = () => {
	/** @type {[boolean, function]} Internal flag to track client-side mounting. */
	const [isMounted, setIsMounted] = useState(false);

	/**
	 * Effect Hook: Synchronizes the component with the browser lifecycle.
	 * Triggers the mounting process once the DOM is ready.
	 */
	useEffect(() => {
		setIsMounted(true);
	}, []);

	/**
	 * Safety Interlock:
	 * If the component is not yet mounted (SSR phase), we return null to
	 * maintain DOM integrity and avoid hydration errors.
	 */
	if (!isMounted) return null;

	return <CookieConsent variant="default" className="z-[100] border-primary/20 shadow-2xl shadow-primary/10" learnMoreHref="/dashboard/privacy" />;
};
