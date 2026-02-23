"use client";

import { Hero } from "@/components/ui/Hero";
import { useUser } from "@/core/providers/UserProvider";
import { useWorkouts } from "@/features/workouts/_hooks/use-workout";
import { WorkoutUI } from "@/types/workouts";
import { WelcomeHeader } from "./WelcomeHeader";
import { Separator } from "@/components/ui/separator";
import { WorkoutHistory } from "@/features/workouts/components/WorkoutsHistory";
import { RecentWorkoutsHeader } from "./RecentWorkoutsHeader";

interface FeedClientViewProps {
	/** * Pre-fetched workout data from the Server Component.
	 * Used to hydrate the TanStack Query cache on the client.
	 */
	initialWorkouts: WorkoutUI[];
}

/**
 * Main client-side orchestrator for the Dashboard Feed.
 * It manages the visual layout of the hero section, user greetings, and the
 * paginated recent workouts list using a hydrated TanStack Query cache.
 */
export const FeedClientView = ({ initialWorkouts }: FeedClientViewProps) => {
	/** * Accesses global user context to provide a personalized greeting
	 * and a unique key for the workout query.
	 */
	const { user } = useUser();

	/** * Manages workout data state.
	 * React Query takes over after initial hydration to handle background updates
	 * and persistent caching without unnecessary database calls.
	 */
	const { data: workouts, isLoading } = useWorkouts(user?.id || "", initialWorkouts);

	return (
		<div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 gap-4">
			<Hero />
			<WelcomeHeader />
			<Separator />
			<RecentWorkoutsHeader />

			{/* Workout History List:
              Renders the list of workouts derived from the TanStack Query cache.
              Falls back to an empty array to ensure component stability during data transitions.
             */}

			<WorkoutHistory workouts={workouts || []} />
			<Separator />
		</div>
	);
};
