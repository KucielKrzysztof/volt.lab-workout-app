/**
 * @fileoverview Hook for monitoring device connectivity status.
 */

import { useState, useEffect } from "react";

/**
 * useOnlineStatus
 * * Tracks the real-time connectivity of the operator's device.
 * * @returns {boolean} True if the device is online, false if offline.
 */
export function useOnlineStatus() {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		// Initial calibration
		setIsOnline(navigator.onLine);

		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return isOnline;
}
