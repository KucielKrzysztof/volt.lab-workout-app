/**
 * @fileoverview Dynamic Notification Wrapper for the VOLT.LAB ecosystem.
 * Synchronizes the Sonner toast system with the active visual mode (Dark/Light).
 * @module components/ui
 */

"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/**
 * Theme-Aware Toast Provider.
 * * @description
 * This component acts as a **Reactive Bridge** between 'next-themes' and 'sonner'.
 * It ensures that notification styling (backgrounds, borders, text)
 * instantly reflects the current theme state of the application.
 * * **Resolved Theme Detection**: Utilizes `resolvedTheme` instead of `theme`.
 * This is critical because `theme` can be "system", which Sonner does not
 * natively support. `resolvedTheme` guarantees a fallback to "light" or "dark".
 * * @returns {JSX.Element} The theme-synchronized Toaster instance.
 */
export function ThemeToaster() {
	/** * Accesses the current theme status.
	 * 'resolvedTheme' provides the actual theme being rendered,
	 * even if the setting is currently 'system'.
	 */
	const { resolvedTheme } = useTheme();

	return <Toaster theme={(resolvedTheme as "light" | "dark") || "dark"} position="top-center" closeButton richColors className="toaster group" />;
}
