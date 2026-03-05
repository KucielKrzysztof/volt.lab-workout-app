/**
 * @fileoverview Headless hook for TemplateCard logic.
 * Encapsulates complex state transitions, navigation, and asynchronous
 * mutations to decouple business logic from the UI layer.
 * @module features/templates/hooks
 */

import { useRouter } from "next/navigation";
import { useUser } from "@/core/providers/UserProvider";
import { useActiveWorkoutStore } from "@/features/workouts/_hooks/use-active-workout-store";
import { useDeleteTemplate } from "../_hooks/use-delete-template";
import { WorkoutTemplateUI } from "@/types/templates";
import { toast } from "sonner";

/**
 * Custom hook for managing TemplateCard behaviors.
 * * @description
 * This headless hook serves as the functional brain of the routine card. It manages
 * the intersection between local component interactions and global system states
 * (Zustand, TanStack Query, and Next.js Routing).
 * * **Core Functional Pillars:**
 * 1. **Session Lifecycle Management**: Controls the transition from a static
 * blueprint to an active, persisted workout session.
 * 2. **Destructive Mutation Handling**: Orchestrates the deletion flow with
 * integrated loading states and cache invalidation.
 * 3. **Navigation Logic**: Manages routing to the specialized editor with
 * zero-latency cache expectations.
 * * **Logic Flow:**
 * {Template UI Event} > {Validation (isWorkoutActive)} > {State Dispatch} > {Side Effect (Navigate/Toast)}
 * * @param {WorkoutTemplateUI} template - The UI-ready template object to be managed.
 * @returns {Object} An object containing operational states and event handlers.
 */
export const useTemplateCard = (template: WorkoutTemplateUI) => {
	const { user } = useUser();
	const router = useRouter();

	/** * Deletion Hook:
	 * Manages the asynchronous destruction of the template and cache invalidation.
	 */
	const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate(user?.id || "");

	/** * Zustand Store Integration:
	 * Accesses both the state setter for initializing sessions and the
	 * reactive `startTime` flag to determine if a session is currently running.
	 */
	const startFromTemplate = useActiveWorkoutStore((state) => state.startFromTemplate);
	const isWorkoutActive = useActiveWorkoutStore((state) => !!state.startTime);

	/**
	 * Orchestrates the transition from blueprint to active session.
	 * * @description
	 * 1. **Propagation Control**: Stops event bubbling to prevent accidental triggers in nested layouts.
	 * 2. **Validation**: Checks `isWorkoutActive`. If true, the operation is aborted with a toast notification.
	 * 3. **Hydration**: Populates the global `ActiveWorkoutStore` with the selected template's data.
	 * 4. **Navigation**: Redirects the user to the live tracking workspace.
	 * * @param {React.MouseEvent} e - The mouse event from the Play button trigger.
	 */
	const handleStartWorkout = (e: React.MouseEvent) => {
		e.stopPropagation();
		// Guard Clause: Prevent concurrent active sessions.
		if (isWorkoutActive) {
			toast.error("You already have an active session! Finish it first.");
			return;
		}
		// Transition logic.
		startFromTemplate(template);
		router.push("/dashboard/active-workout");
		toast.success(`Started: ${template.name}`);
	};

	/**
	 * Navigation Handler: Blueprint Calibration.
	 * * @description
	 * Redirects to the editor. Since data is already available in the
	 * TanStack Query cache, the `TemplateEditClientView` will perform
	 * an instant hydration.
	 */
	const handleEdit = () => {
		router.push(`/dashboard/templates/edit/${template.id}`);
	};

	/**
	 * Orchestrates the deletion of the workout routine blueprint.
	 * * @description
	 * This handler is now encapsulated within the AlertDialog flow.
	 * It ensures the deletion only proceeds after explicit user confirmation,
	 * leveraging a high-contrast modal instead of native browser prompts.
	 * * **Pipeline:**
	 * 1. **Trigger**: User clicks the trash icon.
	 * 2. **Verification**: AlertDialog presents the routine name for confirmation.
	 * 3. **Dispatch**: Upon clicking 'Continue', the `deleteTemplate` mutation is fired.
	 */
	const onConfirmDelete = () => {
		deleteTemplate(template.id);
	};

	return {
		/** @type {boolean} State flag indicating an in-progress deletion. */
		isDeleting,
		/** @type {boolean} State flag indicating if any workout is currently active. */
		isWorkoutActive,
		/** @function Initiates a workout from the current template. */
		handleStartWorkout,
		/** @function Navigates to the template editor. */
		handleEdit,
		/** @function Finalizes the template deletion process. */
		onConfirmDelete,
	};
};
