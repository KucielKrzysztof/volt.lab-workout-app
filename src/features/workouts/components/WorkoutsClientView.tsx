/**
 * @fileoverview Main View for the Workouts History feature.
 * Coordinates the transition from server-side pre-fetched data to a fully
 * interactive, infinite-scrolling client-side experience.
 * @module features/workouts/components
 */

"use client";

import { StartWorkoutCard } from "@/features/workouts/components/StartWorkoutCard";
import { WorkoutHistory } from "@/features/workouts/components/WorkoutsHistory";

import { WorkoutsClientHeader } from "./WorkoutsClientHeader";
import { useUser } from "@/core/providers/UserProvider";
import { useWorkouts } from "../_hooks/use-workouts";
import { WorkoutPage } from "@/types/workouts";

/**
 * Interface defining the properties for the WorkoutsClientView component.
 * @interface WorkoutClientViewProps
 * @property {WorkoutPage} initialData - A composite object containing the first
 * page of mapped workouts and the total record count, pre-fetched on the server.
 */
interface WorkoutClientViewProps {
	initialData: WorkoutPage;
}

/**
 * The primary client-side entry point for the Workout History ecosystem.
 * * @description
 * This component implements the **SSR-to-CSR Hydration Pattern**. It acts as the
 * "Hydration Bridge" by taking server-side results and seeding the client-side
 * infinite query cache. This ensures that the user encounters zero "loading flickers"
 * or Layout Shifts (CLS) while navigating to the workouts dashboard.
 * * **Key Architectural Pillars:**
 * 1. **Cache Priming**: Orchestrates the initial state of the `useWorkouts` hook
 * using the `initialData` prop.
 * 2. **Auth-Bound Data Scoping**: Links the authenticated `user.id` to the
 * query key, ensuring strict data isolation within the TanStack Query cache.
 * 3. **Modular Composition**: Assemble high-level features like the session
 * trigger (`StartWorkoutCard`) and the paginated feed (`WorkoutHistory`).
 * * **Data Flow Model:**
 *{initialData} > {useWorkouts (Hydration)} > {Query Bundle} > {Infinite Feed}$
 * * @param {WorkoutClientViewProps} props - Component properties.
 * @returns {JSX.Element} The fully orchestrated workout history dashboard.
 */
export const WorkoutsClientView = ({ initialData }: WorkoutClientViewProps) => {
	/** * Authentication Context:
	 * Retrieves the current user session. The ID is used to scope the
	 * infinite query, preventing data contamination between sessions.
	 */
	const { user } = useUser();

	/** * Infinite Data Orchestration:
	 * TanStack Query takes ownership of the data lifecycle here.
	 * It uses 'initialData' to bypass the first network request and
	 * provides the 'queryBundle' required for scroll-based pagination.
	 */
	const queryBundle = useWorkouts(user?.id || "", initialData);

	return (
		<div className="flex flex-col space-y-10 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
			<WorkoutsClientHeader />

			{/* Quick-action card to initiate a new active workout session */}
			<StartWorkoutCard />

			{/* Data Layer: The infinite-scrolling historical feed */}
			<WorkoutHistory queryBundle={queryBundle} />
		</div>
	);
};
