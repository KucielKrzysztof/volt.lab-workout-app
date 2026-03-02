/**
 * @fileoverview Workouts History Module - Server-side Entry Point.
 * Orchestrates the initial data acquisition for the workout history dashboard,
 * serving as the root shell that initiates the hydration bridge.
 * @module app/dashboard/workouts
 */

import { getWorkoutsServer } from "@/features/workouts/api/get-workouts-server";
import { WorkoutsClientView } from "@/features/workouts/components/WorkoutsClientView";

/**
 * Workouts Page Component.
 * * @description
 * This is a **Next.js Server Component** that acts as the primary entry point for
 * the workout history feature. It leverages the "Fetch-on-Server" strategy to
 * mitigate network waterfalls and ensure a high-performance first paint.
 * * **Architectural Pattern: SSR-to-CSR Hydration**
 * 1. **Data Pre-fetching**: Invokes `getWorkoutsServer` to pull the first page
 * of records and the total database count during the server-side render cycle.
 * 2. **Cache Seeding**: Injects the result into the `WorkoutsClientView` as `initialData`.
 * 3. **Hydration Bridge**: Allows TanStack Query on the client to "take over"
 * the data stream using the pre-fetched state, eliminating secondary loading flickers.
 * * @returns {Promise<JSX.Element>} The server-rendered shell for the workouts view.
 */
export default async function WorkoutsPage() {
	/** * Initial Data Acquisition:
	 * Executes an authenticated request to the workout service.
	 * This fetch is memoized and handled securely on the server-side.
	 * @type {WorkoutPage} items: WorkoutUI[], totalCount: number
	 */
	const initialData = await getWorkoutsServer();

	/** * Transfer of Control:
	 * We pass the 'initialData' object to the Client Orchestrator.
	 * This is where the SSR phase ends and the CSR (Client Side Rendering)
	 * interactivity begins.
	 */
	return <WorkoutsClientView initialData={initialData} />;
}
