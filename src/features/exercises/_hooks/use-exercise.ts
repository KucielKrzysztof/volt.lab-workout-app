/**
 * @fileoverview Exercise Library Data Orchestrator.
 * Manages the global state, caching, and hydration of the exercise
 * reference library using TanStack Query v5.
 * @module features/exercises/hooks
 */

import { createClient } from "@/core/supabase/client";
import { exerciseService } from "@/services/apiExercises";
import { Exercise } from "@/types/exercises";
import { useQuery } from "@tanstack/react-query";

export const EXERCISES_QUERY_KEY = ["exercises"];

/**
 * Custom hook for managing exercise data state.
 * * @description
 * This hook provides access to the global library of 400+ exercises. It implements
 * the SSR-to-CSR Hydration Pattern, allowing the library to be pre-rendered
 * on the server and instantly interactive on the client.
 * * @features
 * 1. **Static Data Strategy**: Since the exercise library is highly stable and
 * changes infrequently, `staleTime` is set to 5 hours to virtually eliminate
 * redundant network traffic.
 * 2. **Offline Resilience**: Implements `networkMode: 'offlineFirst'` to prevent
 * query failures when lifters are training in low-connectivity areas like
 * gym basements.
 * 3. **Extended Persistence**: Retains data in the cache for 24 hours (`gcTime`),
 * ensuring the library is available for routine building even without an active uplink.
 * 4. **Zero-Flicker Hydration**: Utilizes `initialData` to seed the cache during
 * the initial server render, preventing Cumulative Layout Shift (CLS).
 * * @param {Exercise[]} [initialData] - Data prefetched on the server to avoid
 * client-side loading states.
 * * @returns {UseQueryResult<Exercise[]>} A query object containing the exercise
 * collection, connectivity status, and hydration metadata.
 */
export const useExercises = (initialData?: Exercise[]) => {
	const supabase = createClient();

	return useQuery({
		/** * Reference to the global namespace key. */
		queryKey: EXERCISES_QUERY_KEY,
		/** * Data Acquisition Logic:
		 * Fetches the complete exercise catalog via the exercise service.
		 */
		queryFn: () => exerciseService.getAllExercises(supabase),
		/** * Hydration Seed:
		 * Injects server-fetched data into the client cache to provide an
		 * 'instant-on' user experience.
		 */
		initialData: initialData,

		/** * Global Connectivity Protocol:
		 * Optimized for static data: 5h freshness and 24h persistence for offline use.
		 */
		staleTime: 1000 * 60 * 60 * 5,
		gcTime: 1000 * 60 * 60 * 24,
		networkMode: "offlineFirst",
	});
};
