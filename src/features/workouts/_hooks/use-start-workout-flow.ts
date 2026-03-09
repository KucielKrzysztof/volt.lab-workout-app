/**
 * @fileoverview Logic orchestrator for starting workout sessions.
 * Refactored to support the Hybrid Session Engine: handles both blueprint-based
 * initiations and dynamic "On-The-Fly" empty sessions.
 * * Orchestrates the transition from user intent to active state, managing
 * data acquisition, session guarding, and routing logic.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTemplates } from "@/features/templates/_hooks/use-templates";
import { useActiveWorkoutStore } from "./use-active-workout-store";
import { WorkoutTemplateUI } from "@/types/templates";

/**
 * Custom hook orchestrating the complex workout initiation flow.
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

	/** * Atomic Store Actions:
	 * Accesses the persistent Zustand store to manipulate the active session state.
	 */
	const startTime = useActiveWorkoutStore((state) => state.startTime);
	const startFromTemplate = useActiveWorkoutStore((state) => state.startFromTemplate);
	const startEmptyWorkout = useActiveWorkoutStore((state) => state.startEmptyWorkout);

	/** * Session Guard Logic:
	 * Boolean flag derived from the presence of a startTime, preventing
	 * simultaneous active session conflicts.
	 */
	const isWorkoutActive = !!startTime;

	/**
	 * Executes the session startup sequence.
	 * * @description
	 * 1. Updates the global store with the selected routine's data.
	 * 2. Closes the selection drawer.
	 * 3. Redirects the browser to the dedicated active-workout route.
	 * @param {WorkoutTemplateUI} template - The mapped routine object selected by the user.
	 */
	const handleSelectTemplate = (template: WorkoutTemplateUI) => {
		startFromTemplate(template);
		setIsSheetOpen(false);
		router.push("/dashboard/active-workout");
	};

	/**
	 * Executes the "On-The-Fly" (Empty Session) startup sequence.
	 * * @description
	 * 1. Initializes a blank session with `template_id: null` to bypass pre-defined data.
	 * 2. Bypasses blueprint mapping, allowing immediate exercise injection via the dynamic selector.
	 * 3. Syncs the state to localStorage to ensure session persistence.
	 */
	const handleStartEmpty = () => {
		startEmptyWorkout();
		setIsSheetOpen(false);
		router.push("/dashboard/active-workout");
	};

	return {
		/** List of available training blueprints */
		templates,
		/** Network status of the template fetch operation */
		isLoading,
		/** Conflict detection flag for active sessions */
		isWorkoutActive,
		/** UI state for the selection drawer visibility */
		isSheetOpen,
		/** State setter for controlling drawer lifecycle */
		setIsSheetOpen,
		/** Protocol: Blueprint initiation */
		handleSelectTemplate,
		/** Protocol: Dynamic On-The-Fly initiation */
		handleStartEmpty,
	};
};
