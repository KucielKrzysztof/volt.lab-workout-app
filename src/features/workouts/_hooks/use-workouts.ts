/**
 * @fileoverview Headless Data Orchestrator for Infinite Workout History.
 * Leverages TanStack Query v5 `useInfiniteQuery` to manage a memory-efficient,
 * paginated data stream from the Supabase 'workouts' table.
 * @module features/workouts/hooks
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { workoutService } from "@/services/apiWorkouts";
import { mapWorkoutForUI } from "../helpers/workoutHelpers";
import { WorkoutPage } from "@/types/workouts";

/** Constant defining the batch size for each network request. */
const PAGE_SIZE = 10;

/**
 * Custom hook to manage, cache, and synchronize infinite scrolling of workout history.
 * * @description
 * This hook acts as the "Engine" for the Workout Feed. It implements a sophisticated
 * **Infinite Loading Pattern** that decouples the UI from the underlying
 * pagination logic.
 * * **Core Operational Capabilities:**
 * 1. **Stateless Pagination**: Utilizes zero-based page indices mapped to
 * PostgREST `.range(from, to)` increments.
 * 2. **SSR-to-CSR Hydration Bridge**: Intelligently seeds the multi-page cache
 * with server-side pre-fetched `initialData`, eliminating Cumulative Layout Shift (CLS).
 * 3. **Stream Exhaustion Detection**: Implements a "Smart Termination" algorithm in
 * `getNextPageParam` to prevent redundant API calls once the database is exhausted.
 * 4. **Data Normalization**: Centralizes the mapping of raw database entities into
 * `WorkoutUI` models, ensuring the cache only stores "ready-to-render" data.
 * * @param {string} userId - UUID of the authenticated user (primary cache key).
 * @param {WorkoutPage} [initialData] - Optional pre-fetched first page from SSR.
 * * @returns {UseInfiniteQueryResult<InfiniteData<WorkoutPage>>} A query object providing
 * flattened `data.pages`, `fetchNextPage` trigger, and loading status.
 */
export const useWorkouts = (userId: string, initialData?: WorkoutPage) => {
	const supabase = createClient();

	return useInfiniteQuery({
		/** * Deterministic Query Cache Key:
		 * Scoped to the 'workouts' namespace and the specific 'userId'.
		 * Prevents cross-account data leakage in multi-user environments.
		 */
		queryKey: ["workouts", userId],

		/**
		 * Page Acquisition Function.
		 * * @description
		 * Injected with `pageParam` by TanStack Query. It fetches raw records and
		 * includes the `totalCount` metadata for global analytical awareness.
		 * @async
		 * @returns {Promise<WorkoutPage>} A hydrated data slice.
		 */
		queryFn: async ({ pageParam = 0 }): Promise<WorkoutPage> => {
			const { data, count } = await workoutService.getWorkouts(supabase, userId, pageParam as number, PAGE_SIZE);

			/** * Transformation Cycle:
			 * We execute mapping inside the query function so that the React Query
			 * DevTools and cache always hold the final, localized UI format.
			 */
			return {
				items: (data || []).map(mapWorkoutForUI),
				totalCount: count || 0,
			};
		},

		/** Initial parameter(index) passed to queryFn on mount. */
		initialPageParam: 0,

		/**
		 * Determines the next request's page index.
		 * * @description
		 * If the current page has fewer items than `PAGE_SIZE`, we assume the
		 * database is exhausted and return `undefined` to stop further requests.
		 */
		getNextPageParam: (lastPage, allPages) => {
			const isLastPage = lastPage.items.length < PAGE_SIZE;
			return isLastPage ? undefined : allPages.length;
		},

		/**
		 * Hydration Logic (SSR Bridge):
		 * * @description
		 * Wraps the singular `initialData` page into the `InfiniteData` structure
		 * required for the internal TanStack Query cache management.
		 */
		initialData: initialData
			? {
					pages: [initialData],
					pageParams: [0],
				}
			: undefined,

		// Data fresh for 5 mins
		staleTime: 1000 * 60 * 5,
	});
};
