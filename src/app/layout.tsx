import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import QueryProvider from "@/core/providers/QueryProvider";
import { UserProvider } from "@/core/providers/UserProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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
 * Main application shell (App Router).
 * Sets up global providers, fonts, and SEO metadata.
 * Includes NextTopLoader for progress indication during navigation.
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
				{/* Progress bar for client-side navigation.
				 */}
				<NextTopLoader
					color="var(--primary)"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={false}
					easing="ease"
					speed={200}
					// Sync the glow effect with the theme's primary color
					shadow="0 0 10px var(--primary), 0 0 5px var(--primary)"
				/>

				{/* Global toast notification system */}
				<Toaster theme="dark" position="bottom-right" closeButton richColors />

				{/* Context Provider Layering:
                  QueryProvider is placed at the top to allow UserProvider or any sub-component 
                  to potentially pre-fetch or invalidate queries based on auth state.
                */}
				<QueryProvider>
					<UserProvider>{children}</UserProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
