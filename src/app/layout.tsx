/**
 * @fileoverview Main application Layout.
 * Orchestrates the global configuration of VOLT.LAB, including fonts,
 * SEO metadata, and the hierarchical provider tree.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import QueryProvider from "@/core/providers/QueryProvider";
import { UserProvider } from "@/core/providers/UserProvider";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import { ThemeToaster } from "@/components/ui/ThemeToaster";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { CookieGovernance } from "@/components/ui/CookieGoverance";

// --- FONT CONFIGURATION ---
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// --- SEO & PLATFORM METADATA ---
/**
 * Viewport configuration optimized for mobile-first experience.
 */
export const viewport: Viewport = {
	themeColor: "#141413",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export const metadata: Metadata = {
	title: "VOLT.LAB",
	description: "build your power",
	icons: {
		icon: "/logos/logo-1.png",
		apple: "/logos/mobile.png",
	},
	manifest: "/manifest.json",
};

/**
 * RootLayout: The primary document orchestrator.
 * * @description
 * This version implements **Cookie-based Theme Hydration**. By reading the
 * 'theme' cookie on the server, we can inject the correct CSS class
 * into the <html> tag during SSR.
 */
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	/** * Server-Side Theme Detection:
	 * We retrieve the 'theme' cookie set by our proxy (middleware).
	 * This ensures the server and client are perfectly aligned from byte zero.
	 */
	const cookieStore = await cookies();
	const theme = cookieStore.get("theme")?.value || "dark";

	return (
		/** * We inject the theme class directly into the <html> tag.
		 * 'suppressHydrationWarning' is still needed because next-themes
		 * might modify attributes after the initial render.
		 */
		<html lang="en" className={theme} suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
				{/* GLOBAL NAVIGATION PROGRESS*/}
				<NextTopLoader
					color="var(--primary)"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={false}
					easing="ease"
					speed={200}
					shadow="0 0 10px var(--primary), 0 0 5px var(--primary)"
				/>

				{/* Global Offiline Monitoring */}
				<OfflineIndicator />

				{/* THEME PROVIDER
                  'defaultTheme' is set to the server-detected value to ensure 
                  the client-side hydration matches the server-side HTML.
                */}
				<ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false} disableTransitionOnChange>
					{/* Global toast notification system */}
					<ThemeToaster />

					{/* NEW: COOKIE COMPLIANCE PROTOCOL */}
					<CookieGovernance />

					{/* Context Provider Layering:
                  QueryProvider is placed at the top to allow UserProvider or any sub-component 
                  to potentially pre-fetch or invalidate queries based on auth state.
				  */}
					<QueryProvider>
						<UserProvider>{children}</UserProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
