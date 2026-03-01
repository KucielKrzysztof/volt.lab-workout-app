/**
 * @fileoverview Main View for the Workouts History feature.
 * Coordinates the integration between server-side pre-fetched data and
 * client-side interactivity, managing the lifecycle of the workout history feed.
 * @module features/workouts/components
 */

"use client";

import { StartWorkoutCard } from "@/features/workouts/components/StartWorkoutCard";
import { WorkoutHistory } from "@/features/workouts/components/WorkoutsHistory";

import { WorkoutUI } from "@/types/workouts";
import { WorkoutsClientHeader } from "./WorkoutsClientHeader";
import { useUser } from "@/core/providers/UserProvider";
import { useWorkouts } from "../_hooks/use-workouts";

interface WorkoutClientViewProps {
	/** * Initial workout data fetched on the server to hydrate the client cache.
	 * This ensures the UI is populated immediately upon page load.
	 */
	initialWorkouts: WorkoutUI[];
}

/**
 * The primary client-side entry point for the Workout History dashboard.
 * * @description
 * This component acts as a "Bridge" in the **SSR-to-CSR Hydration Pattern**.
 * It ensures that the user sees their workout history immediately upon page load
 * (via `initialWorkouts`) while simultaneously enabling TanStack Query to manage
 * background updates and caching for subsequent interactions.
 * * **Key Functional Responsibilities:**
 * 1. **Cache Seeding**: Passes server-side data to the `useWorkouts` hook to
 * eliminate "Loading..." states and Layout Shift (CLS).
 * 2. **Session Context**: Bridges the authenticated user context with the data
 * fetching layer to ensure scoped, secure requests.
 * 3. **Component Orchestration**: Composes the high-level Header, the session
 * initiation trigger (`StartWorkoutCard`), and the historical feed (`WorkoutHistory`).
 * * @param {WorkoutClientViewProps} props - Component properties.
 * @returns {JSX.Element} The fully orchestrated workouts dashboard.
 */
export const WorkoutsClientView = ({ initialWorkouts }: WorkoutClientViewProps) => {
	/** * Authentication Context:
	 * Retrieves the current user profile. The `user.id` serves as a vital
	 * dependency for the underlying query cache key.
	 */
	const { user } = useUser();

	/** * React Query takes over data management after the initial render.
	 * It uses 'initialWorkouts' to seed the cache, preventing layout shifts
	 * and unnecessary network requests on mount.
	 */
	const { data: workouts, isLoading } = useWorkouts(user?.id || "", initialWorkouts);

	return (
		<div className="flex flex-col space-y-10 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
			<WorkoutsClientHeader />

			{/* Quick-action card to initiate a new active workout session - TODO */}
			<StartWorkoutCard />

			{/* Workout History Feed:
              Renders the list of past sessions. It prioritizes data from the React Query cache 
             and falls back to an empty array to ensure component stability.
              */}
			<WorkoutHistory workouts={workouts || []} />
		</div>
	);
};
