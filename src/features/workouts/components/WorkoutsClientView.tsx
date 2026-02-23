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
 * Main Orchestrator for the Workouts history view.
 * Integrates the high-level header, session initiation triggers, and the
 * paginated/infinite scroll workout history list
 * * This component manages the transition from Server-Side Rendering (SSR)
 * to Client-Side interactivity via TanStack Query.
 */
export const WorkoutsClientView = ({ initialWorkouts }: WorkoutClientViewProps) => {
	/** * Retrieves the current authenticated user context to scope the data query
	 * and maintain session awareness.
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
