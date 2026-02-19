import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import QueryProvider from "@/core/providers/QueryProvider";

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
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
				<NextTopLoader
					color="#ffffff"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={false}
					easing="ease"
					speed={200}
					shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
				/>
				{/* Global TanStack Query context provider */}
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
