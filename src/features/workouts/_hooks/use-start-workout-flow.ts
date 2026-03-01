/**
 * @fileoverview Logic orchestrator for starting a workout session.
 * Decouples session initiation logic, state management, and navigation from the UI.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTemplates } from "@/features/templates/_hooks/use-templates";
import { useActiveWorkoutStore } from "./use-active-workout-store";
import { WorkoutTemplateUI } from "@/types/templates";

/**
 * Orchestrates the flow of starting a workout.
 * @param {string} userId - The current user's ID for template fetching.
 * @returns {Object} State and handlers for the workout start flow.
 */
export const useStartWorkoutFlow = (userId: string) => {
	const router = useRouter();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	/** * Data Acquisition:
	 * Retrieves the user's routine library. The loading state is reflected in the
	 * selection sheet via a `Loader2` spinner.
	 */
	const { data: templates, isLoading } = useTemplates(userId);

	// Store interactions
	const startTime = useActiveWorkoutStore((state) => state.startTime);
	const startFromTemplate = useActiveWorkoutStore((state) => state.startFromTemplate);

	const isWorkoutActive = !!startTime;

	/**
	 * Executes the session startup sequence.
	 * * @description
	 * 1. Updates the global store with the selected routine's data.
	 * 2. Closes the UI sheet.
	 * 3. Redirects the browser to the dedicated active-workout route.
	 * @param {WorkoutTemplateUI} template - The mapped routine object selected by the user.
	 */
	const handleSelectTemplate = (template: WorkoutTemplateUI) => {
		startFromTemplate(template);
		setIsSheetOpen(false);
		router.push("/dashboard/active-workout");
	};

	return {
		templates,
		isLoading,
		isWorkoutActive,
		isSheetOpen,
		setIsSheetOpen,
		handleSelectTemplate,
	};
};
