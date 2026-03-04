/**
 * @fileoverview Headless Hook for Global Application Settings.
 * Enhanced with Cookie Sync to support SSR Theme strategy.
 * @module features/settings/_hooks
 */

import { useTheme } from "next-themes";

/**
 * Unified hook for accessing and modifying application settings.
 * * @description
 * Acts as a Facade over 'next-themes' to ensure every theme change
 * is broadcasted to the Proxy/Middleware via browser cookies.
 * * @returns {Object} An interface for settings management.
 */
export const useSettings = () => {
	const { theme, setTheme, resolvedTheme } = useTheme();

	/**
	 * Internal state & cookie orchestrator.
	 * * @description
	 * Updates the reactive state in the ThemeProvider and persists the
	 * choice in a long-lived cookie.
	 * * @param {string} newTheme - The target theme mode ('light' | 'dark').
	 */
	const updateTheme = (newTheme: string) => {
		// 1. Sync with next-themes (localStorage + Context)
		setTheme(newTheme);

		// 2. Sync with Browser Cookies (Server-side visibility)
		// SameSite=Lax ensures the cookie is sent during navigation while maintaining security.
		document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
	};

	/**
	 * Toggles between 'light' and 'dark' visual modes.
	 * * @description
	 * Uses 'resolvedTheme' instead of 'theme' to accurately detect the
	 * current mode even when the initial setting is 'system'.
	 */
	const toggleTheme = () => {
		const targetTheme = resolvedTheme === "dark" ? "light" : "dark";
		updateTheme(targetTheme);
	};

	return {
		/** The current theme setting ('light', 'dark', or 'system') */
		theme,
		/** Direct mutation function with cookie synchronization */
		setTheme: updateTheme,
		/** High-level interaction handler for cycling modes */
		toggleTheme,
	};
};
