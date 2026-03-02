/**
 * @fileoverview Main Orchestrator for the Chronological Workout History Feed.
 * Coordinates the high-level state machine (Loading -> Empty -> Populated)
 * and flattens paginated data structures for the presentation layer.
 * @module features/workouts/components
 */

import { Loader2 } from "lucide-react";
import { WorkoutList } from "./WorkoutList";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { WorkoutPage } from "@/types/workouts";

/**
 * Interface for the WorkoutHistory component.
 * @interface WorkoutHistoryProps
 * @property {UseInfiniteQueryResult<InfiniteData<WorkoutPage>>} queryBundle - The full
 * TanStack Query infinite result object, providing paginated state and fetch triggers.
 */
interface WorkoutHistoryProps {
	queryBundle: UseInfiniteQueryResult<InfiniteData<WorkoutPage>>;
}

/**
 * Orchestrates the workout history display and pagination lifecycle.
 * * @description
 * This component acts as a **Smart Container**. It is responsible for "unpacking"
 * the multi-page data structure provided by `useWorkouts` and deciding which
 * structural guard (Loading spinner, Empty message, or List) to render.
 * * **Architectural Responsibilities:**
 * 1. **Data Normalization**: Flattens the `pages` array from the infinite query
 * into a continuous `WorkoutUI[]` stream for the `WorkoutList`.
 * 2. **Metadata Extraction**: Retrieves global session counts from the first
 * page's metadata to provide user context (Total in DB).
 * 3. **State Management**: Encapsulates the logic for initial loading and
 * zero-data fallback states.
 * 4. **Composition**: Seamlessly integrates the presentation layer (`WorkoutList`)
 * with the technical pagination layer (`InfiniteScrollTrigger`).
 * * @param {WorkoutHistoryProps} props - Component properties.
 * @returns {JSX.Element} The orchestrated workout feed section.
 */
export const WorkoutHistory = ({ queryBundle }: WorkoutHistoryProps) => {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = queryBundle;

	/** * Data Flattening Logic:
	 * We map the multi-page structure [[Page 1], [Page 2]] into a singular
	 * linear array. This ensures the 'WorkoutList' remains a pure presenter.
	 */
	const workouts = data?.pages.flatMap((page) => page.items) || [];

	/** * Global Metadata Access:
	 * We extract the 'totalCount' from the first page's metadata. This represents
	 * the absolute number of records in the database, regardless of how many are loaded.
	 */
	const totalWorkoutsInDb = data?.pages[0]?.totalCount ?? 0;

	// Guard 1: Initial Loading State
	if (isLoading) {
		return <Loader2 className="animate-spin text-primary opacity-20 w-8 h-8 mt-20" />;
	}

	// Guard 2: Empty State
	if (workouts.length === 0) {
		return <p className="text-muted-foreground italic">No recent workouts yet!</p>;
	}
	return (
		<section className="space-y-6 w-full">
			{/* Header: Statistical Context */}
			<div className="flex items-start flex-col">
				<h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">Workout history</h2>
				<p className="text-[10px] opacity-40 uppercase font-mono italic">Total: {totalWorkoutsInDb}</p>
			</div>

			{/* Presentation Layer: Iterates over the flattened workout stream */}
			<WorkoutList workouts={workouts} />

			{/* Pagination Layer: Manages the viewport detection and fetch triggers */}
			<InfiniteScrollTrigger hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
		</section>
	);
};
