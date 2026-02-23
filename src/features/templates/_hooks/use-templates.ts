import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { templateService } from "@/services/apiTemplates";
import { mapTemplateForUI } from "../helpers/templateHelpers";
import { WorkoutTemplateUI, WorkoutTemplateJoined } from "@/types/templates";

/**
 * Custom hook to manage and cache workout templates.
 * Implements the "Hydration" pattern by accepting initial data from Server Components
 * to ensure instant rendering on mount.
 * * @param userId - Unique user identifier used as a cache key dependency.
 * @param initialData - Optional pre-fetched UI-ready templates from the server.
 * @returns A query object containing mapped templates, loading states, and error info.
 */
export const useTemplates = (userId: string, initialData?: WorkoutTemplateUI[]) => {
	const supabase = createClient();

	return useQuery({
		/** * Unique identifier for the templates cache.
		 * Scoped to the userId to prevent data leakage between sessions.
		 */
		queryKey: ["templates", userId],

		/**
		 * Fetches nested relational data and transforms it into a flat UI model.
		 * Mapping happens here so components receive optimized data directly from the cache.
		 */
		queryFn: async (): Promise<WorkoutTemplateUI[]> => {
			const { data, error } = await templateService.getTemplates(supabase, userId);

			if (error) throw error;

			/** * Casting raw response to the Joined interface before mapping.
			 * This ensures the mapper receives the expected nested structure.
			 */
			const rawTemplates = (data as unknown as WorkoutTemplateJoined[]) || [];
			return rawTemplates.map(mapTemplateForUI);
		},

		/** * Seeds the cache with server-side data to eliminate client-side loading flickers.
		 */
		initialData,

		/**
		 * Templates are generally more static than workout history.
		 * Set to 1 hour (60 mins) to reduce redundant background refetches.
		 */
		staleTime: 1000 * 60 * 60,
	});
};
