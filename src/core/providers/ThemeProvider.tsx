/**
 * @fileoverview Application Theme Infrastructure.
 * Provides the context for theme switching and CSS variable distribution
 * across the VOLT.LAB ecosystem.
 * @module core/providers
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider Component.
 * * @description
 * A wrapper for 'next-themes' that orchestrates the client-side lifecycle of visual modes.
 * It is specifically configured to support **Cookie-based SSR**, receiving its
 * 'defaultTheme' from the RootLayout to ensure perfect hydration.
 * * **Strategic Configuration:**
 * 1. **Attribute Injection**: Uses the 'class' attribute on the `<html>` tag to
 * trigger Tailwind v4 dark mode variants.
 * 2. **System Preference Override**: Controlled via `enableSystem={false}` in the
 * RootLayout to ensure the cookie-stored choice takes absolute precedence.
 * 3. **Flicker Prevention**: Works in tandem with `suppressHydrationWarning`
 * to allow the library to take over the server-rendered class smoothly.
 * * **Data Flow:**
 *{RootLayout (Cookie)} > {defaultTheme} > {ThemeProvider} > {Context Consumption}$
 * * @param {React.ComponentProps<typeof NextThemesProvider>} props - standard 'next-themes' configuration.
 * @returns {JSX.Element} The theme-aware context provider.
 */
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		/**
		 * The provider consumes props passed from the server-side RootLayout.
		 * This includes the 'defaultTheme' resolved from browser cookies.
		 */ <NextThemesProvider {...props}>{children}</NextThemesProvider>
	);
}
