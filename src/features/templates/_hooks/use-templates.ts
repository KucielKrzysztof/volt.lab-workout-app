/**
 * @fileoverview Data orchestration hook for workout template management.
 * Leverages TanStack Query v5 to provide an optimized, cached, and hydrated
 * stream of training routines for the VOLT.LAB ecosystem.
 * @module features/templates/hooks
 */

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { templateService } from "@/services/apiTemplates";
import { mapTemplateForUI } from "../helpers/templateHelpers";
import { WorkoutTemplateUI, WorkoutTemplateJoined } from "@/types/templates";

/**
 * Custom hook to manage and cache workout templates.
 * Implements the "Hydration" pattern by accepting initial data from Server Components
 * to ensure instant rendering on mount.
 * * @param {string} userId - Unique user identifier used as a cache key dependency.
 * @param {WorkoutTemplateUI[]} [initialData] - Optional pre-fetched UI-ready templates from the server.
 * * @returns {UseQueryResult<WorkoutTemplateUI[]>} A comprehensive query object containing
 * the mapped routine array, fetching status, and error metadata.
 * * @example
 * // Implementation in a Dashboard View
 * const { data: templates, isLoading } = useTemplates(user.id, initialTemplates);
 * * if (templates) {
 * templates.map(t => console.log(`Routine: ${t.name}, Exercises: ${t.exerciseCount}`));
 * }
 */
export const useTemplates = (userId: string, initialData?: WorkoutTemplateUI[]) => {
	/** * Initialize Supabase instance.
	 * Utilizes the browser's cookies to maintain the active user session.
	 */
	const supabase = createClient();

	return useQuery({
		/** * Unique identifier for the templates cache.
		 * Scoped to the userId to prevent data leakage between sessions.
		 */
		queryKey: ["templates", userId],

		/**
		 * Fetches nested relational data and transforms it into a flat UI model.
		 * Mapping happens here so components receive optimized data directly from the cache.
		 * @throws {PostgRESTError} If the relational join query fails at the database level.
		 */
		queryFn: async (): Promise<WorkoutTemplateUI[]> => {
			// Retrieves routines with deep exercise metadata.
			const { data, error } = await templateService.getTemplates(supabase, userId);

			if (error) throw error;

			/** * Type-Safe Relational Mapping:
			 * We cast the response to 'WorkoutTemplateJoined' to ensure the mapper
			 * has access to the nested 'template_exercises' array.
			 */
			const rawTemplates = (data as unknown as WorkoutTemplateJoined[]) || [];

			// Transform database snapshots into React-optimized models.
			return rawTemplates.map(mapTemplateForUI);
		},

		/**
		 * Hydration Seed:
		 * Populates the cache with server-side data to eliminate "loading flickers"
		 * and improve the Time to Interactive (TTI).
		 */
		initialData,

		/**
		 * Templates are generally more static than workout history.
		 * Set to 1 hour (60 mins) to reduce redundant background refetches.
		 */
		staleTime: 1000 * 60 * 60,
	});
};
