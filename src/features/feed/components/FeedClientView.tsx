/**
 * @fileoverview Main Client-Side Orchestrator for the Dashboard Feed.
 * Manages the visual layout and data synchronization for the primary user dashboard.
 * @module features/feed/components
 */

"use client";

import { Hero } from "@/components/ui/Hero";
import { useUser } from "@/core/providers/UserProvider";
import { useWorkouts } from "@/features/workouts/_hooks/use-workouts";
import { WorkoutPage } from "@/types/workouts";
import { WelcomeHeader } from "./WelcomeHeader";
import { Separator } from "@/components/ui/separator";
import { WorkoutHistory } from "@/features/workouts/components/WorkoutsHistory";
import { RecentWorkoutsHeader } from "./RecentWorkoutsHeader";

interface FeedClientViewProps {
	/** * Pre-fetched workout page (items + metadata) from the Server Component.
	 * Used to hydrate the infinite TanStack Query cache.
	 */
	initialData: WorkoutPage;
}

/**
 * Dashboard Feed Orchestrator.
 * * @description
 * Manages the composition of the dashboard. It bridges the global user context
 * with the paginated workout history feed, ensuring that the "Recent Activity"
 * section remains synchronized with the database.
 * * **Operational Features:**
 * 1. **Infinite Stream**: Utilizes the `useWorkouts` hook to manage the
 * scroll-based data acquisition.
 * 2. **Personalized UI**: Integrates the Hero and Welcome headers with the
 * current user session.
 * 3. **Hydrated Transition**: Seamlessly hands off the server-side `initialData`
 * to the client-side query engine.
 */
export const FeedClientView = ({ initialData }: FeedClientViewProps) => {
	/** * Accesses global user context to provide a personalized greeting
	 * and a unique key for the workout query.
	 */
	const { user } = useUser();

	/** * Infinite Data Orchestration:
	 * TanStack Query takes over the workout data lifecycle.
	 * We retrieve the full 'queryBundle' to support automatic pagination
	 * in the child components.
	 */
	const queryBundle = useWorkouts(user?.id || "", initialData);

	return (
		<div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 gap-4">
			<Hero />
			<WelcomeHeader />
			<Separator />
			<RecentWorkoutsHeader />

			{/* Workout History List:
         We now pass the 'queryBundle' instead of a raw array. 
                This enables the WorkoutHistory component to handle its 
                own infinite scrolling and total count display.
             */}

			<WorkoutHistory queryBundle={queryBundle} />
			<Separator />
		</div>
	);
};
