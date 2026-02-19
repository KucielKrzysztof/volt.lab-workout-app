"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * Global Provider for TanStack Query (React Query).
 * This component initializes the QueryClient and wraps the application to provide
 * caching and state management capabilities to all child components.
 * * * Features:
 * 1. Client-Side Persistence: Uses useState to ensure the QueryClient instance
 * is created only once during the application's lifecycle.
 * 2. Optimized Defaults: Sets a global staleTime to reduce redundant API calls.
 * 3. DevTools Integration: Enables the debugging overlay in development mode.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
	//  We initialize the QueryClient inside useState to prevent it from being
	//  re-created on every re-render, maintaining a stable cache.
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000 * 30,
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
