import { cache } from "react";
import { createClient } from "@/core/supabase/server";
import { templateService } from "@/services/apiTemplates";
import { mapTemplateForUI } from "../helpers/templateHelpers";
import { WorkoutTemplateUI, WorkoutTemplateJoined } from "@/types/templates";

/**
 * Server-side data fetching utility for Workout Templates.
 * Centrally handles authentication, database retrieval, and UI mapping.
 * Wrapped in React 'cache' to prevent redundant database calls within the same request lifecycle.
 * * @returns {Promise<WorkoutTemplateUI[]>} A promise resolving to an array of mapped template objects.
 */
export const getTemplatesServer = cache(async (): Promise<WorkoutTemplateUI[]> => {
	const supabase = await createClient();

	/** 1. Retrieve and validate the current user session */
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return [];

	/** 2. Fetch raw joined data from the template service */
	const { data, error } = await templateService.getTemplates(supabase, user.id);

	if (error) {
		console.error("❌ getTemplatesServer Error:", error.message);
		return [];
	}

	/** * 3. Map to UI format before returning to the Server Component.
	 * This reduces the processing load on the client side.
	 */
	const rawTemplates = (data as unknown as WorkoutTemplateJoined[]) || [];
	return rawTemplates.map(mapTemplateForUI);
});
