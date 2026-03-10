/**
 * @fileoverview Headless logic for the VOLT.LAB Privacy Protocol.
 * Manages the lifecycle of cookie-based consent tokens with strict adherence
 * to global path scoping and client-side synchronization.
 * @module hooks/useCookieConsent
 */

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * useCookieConsent Hook.
 * * @description
 * A specialized headless hook that orchestrates the reading, writing, and
 * deletion of the 'cookieConsent' token. It acts as the primary authority
 * for the Diagnostic Sniffer and other supplemental data protocols.
 * * @features
 * 1. **Hydration Safety**: Initializes with `null` to prevent SSR mismatches.
 * 2. **Root Scoping**: Forces `path=/` on all operations to ensure domain-wide consistency.
 * 3. **Protocol Synchronization**: Provides a unified method to toggle system-wide authorization.
 * * @returns {Object}
 * - `consent`: Current protocol state (`true` for Authorized, `false` for Restricted, `null` for Uninitialized).
 * - `toggleConsent`: Function to commit a new consent state to the browser's storage.
 */
export const useCookieConsent = () => {
	/** * @type {[boolean | null, function]}
	 * Internal state tracking. `null` represents the pre-hydration phase.
	 */
	const [consent, setConsent] = useState<boolean | null>(null);

	/**
	 * Internal check to synchronize state with document.cookie.
	 */
	useEffect(() => {
		const checkConsent = () => {
			const isAccepted = document.cookie.includes("cookieConsent=true");
			setConsent(isAccepted);
		};

		checkConsent();
	}, []);

	/**
	 * Commit a new state to the Privacy Protocol.
	 * * @param {boolean} targetState - The desired authorization status.
	 * * @description
	 * - If `true`: Sets a persistent cookie with a maximum-duration expiry.
	 * - If `false`: Implements an immediate "Revoke" by setting an expired date.
	 * * @important
	 * Both operations explicitly define `path=/` to prevent path-specific
	 * cookie duplication (e.g., separate cookies for /dashboard and /).
	 */
	const toggleConsent = (targetState: boolean) => {
		if (targetState) {
			// Commit Authorization
			document.cookie = "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
			setConsent(true);
			toast.success("SUPPLEMENTAL PROTOCOLS ACTIVATED");
		} else {
			// Commit Revocation (Expiry Hack)
			document.cookie = "cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
			setConsent(false);
			toast.error("SUPPLEMENTAL PROTOCOLS DEACTIVATED");
		}
	};

	return {
		consent,
		toggleConsent,
	};
};
