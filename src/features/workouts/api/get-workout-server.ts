/**
 * @fileoverview Server-side data fetching utility for the Workout Detail module.
 * Provides an authenticated bridge for pre-fetching relational workout data
 * during the Next.js server-rendering phase.
 * @module features/workouts/api
 */

import { createClient } from "@/core/supabase/server";
import { workoutService } from "@/services/apiWorkouts";

/**
 * Retrieves a single workout session from the database on the server.
 * * @description
 * This function is a key component of the **SSR Hydration Pattern**.
 * By fetching data on the server, it allows the `WorkoutPage` to arrive at the
 * client with data already present, eliminating "loading flickers" and
 * improving SEO and perceived performance.
 * * **Security Note:**
 * Uses the `createClient` from `@/core/supabase/server` to ensure that
 * the request is authenticated via server-side cookies before accessing the database.
 * * @param {string} id - The unique UUID of the workout session to be retrieved.
 * @returns {Promise<Object|null>} A promise resolving to the raw relational workout record
 * including joined sets and exercises, or null if not found.
 * * @example
 * // Inside a Next.js Server Component (page.tsx)
 * const workout = await getWorkoutServer(params.id);
 * return <WorkoutDetailView initialData={workout} id={params.id} />;
 */
export async function getWorkoutServer(id: string) {
	const supabase = await createClient();
	const { data } = await workoutService.getWorkoutById(supabase, id);
	return data;
}
