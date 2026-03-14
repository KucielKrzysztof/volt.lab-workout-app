/**
 * @fileoverview Server-side Entry Point for Individual Workout Analytics.
 * Orchestrates async parameter resolution and server-side data fetching
 * to facilitate zero-flicker hydration for the Detail Workstation.
 * @module app/dashboard/workouts/[id]/page
 */

import { getWorkoutServer } from "@/features/workouts/api/get-workout-server";
import { WorkoutDetailView } from "@/features/workouts/components/details/WorkoutDetailView";

/**
 * @interface WorkoutPageProps
 * @description Contract for Next.js dynamic route parameters.
 * @property {Promise<{ id: string }>} params - Async route parameters containing the workout UUID.
 */
type WorkoutPageProps = {
	params: Promise<{ id: string }>;
};

/**
 * WorkoutPage (Server Component).
 * * @description
 * This is the primary data-fetching hub for the workout detail feature.
 * It implements the **SSR-to-CSR Transition Pattern**:
 * 1. Resolves dynamic route segments asynchronously.
 * 2. Fetches the full workout record on the server (Secure/Fast).
 * 3. Injects the result as `initialData` into the client orchestrator.
 * * @param {WorkoutPageProps} props - The server-side page properties.
 * @returns {Promise<JSX.Element>} The hydrated Detail View interface.
 */
export default async function WorkoutPage({ params }: WorkoutPageProps) {
	const resolvedParams = await params;
	const { id } = resolvedParams;

	/** * Server-Side Data Acquisition:
	 * Fetches the full relational workout model directly from the database
	 * before the client-side JS even begins to execute.
	 */
	const workout = await getWorkoutServer(id);

	/** * Hybrid Hydration:
	 * We pass the 'workout' as 'initialData' to ensure the UI is rendered
	 * instantly with real data, while TanStack Query on the client takes
	 * over for background synchronization.
	 */
	return <WorkoutDetailView id={id} initialData={workout} />;
}
