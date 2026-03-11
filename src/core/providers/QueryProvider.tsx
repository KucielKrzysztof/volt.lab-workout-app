/**
 * @fileoverview Global Provider for TanStack Query (v5).
 * Orchestrates the application's data-fetching layer with a focus on
 * resilience in low-connectivity environments like basement gyms.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * * QueryProvider Component.
 * * @description
 * Global Provider for TanStack Query (React Query).
 * This component initializes the QueryClient and wraps the application to provide
 * caching and state management capabilities to all child components.
 * *Configured with a "Stability-First" protocol
 * to handle intermittent network signals without UI disruption.
 * * * @features
 * 1. **Offline Resilience**: Implements `networkMode: 'offlineFirst'` to pause
 * queries during signal loss instead of triggering error states.
 * 2. **Extended Persistence**: Sets a 24-hour `gcTime` to ensure that
 * historical training data remains available in memory during long offline sessions.
 * 3. **Smart Revalidation**: A 30-minute global `staleTime` minimizes
 * redundant uplink requests while maintaining data freshness.
 * 4. **Hydration Security**: Created within `useState` to maintain a single
 * consistent cache instance across the Next.js client lifecycle
 * 5. DevTools Integration: Enables the debugging overlay in development mode.
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
	//  We initialize the QueryClient inside useState to prevent it from being
	//  re-created on every re-render, maintaining a stable cache.
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						/** * Prevents queries from failing immediately when offline.
						 * Instead, they enter a 'paused' state until the uplink is restored.
						 */
						networkMode: "offlineFirst",
						/** * Garbage Collection Time: Data is kept in the cache for 24 hours
						 * to support deep history browsing in gym environments.
						 */
						gcTime: 1000 * 60 * 60 * 24,
						/** * Global refresh interval set to 30 minutes to reduce
						 * battery drain and unnecessary data usage.
						 */
						staleTime: 60 * 1000 * 30,
						/** * Retry protocol: Attempt to reconnect 3 times before
						 * reporting a technical anomaly.
						 */
						retry: 3,
						/** * Disables automatic background refetching on window focus
						 * to prevent UI jumps during frequent app switching in the gym.
						 */
						refetchOnWindowFocus: false,
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
