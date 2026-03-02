/**
 * @fileoverview Isolated Sentinel Component for Infinite Pagination logic.
 * Encapsulates the Intersection Observer API interactions and manages the
 * visual state transitions of the history's footer.
 * @module features/workouts/components
 */

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

/**
 * Interface for the InfiniteScrollTrigger component.
 * @interface InfiniteScrollTriggerProps
 * @property {boolean} hasNextPage - Flag from TanStack Query indicating if more data exists in the database.
 * @property {boolean} isFetchingNextPage - True when a background network request for the next page is active.
 * @property {Function} fetchNextPage - Callback function to initiate the acquisition of the next data slice.
 */
interface InfiniteScrollTriggerProps {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

/**
 * A technical "Sentinel" component that automates the acquisition of paginated data.
 * * @description
 * This component acts as a **Viewport Watcher**. It renders an invisible or
 * semi-visible element at the end of a list. When this element enters the
 * user's viewport, it triggers the next page fetch.
 * * **Core Operational States:**
 * 1. **Loading State**: Displays an animated spinner and status text when a
 * fetch is in progress.
 * 2. **Ready State**: Renders a subtle bounce animation when idle
 * but more data is available to be loaded.
 * 3. **Exhausted State**: Displays a terminal message when `hasNextPage` is
 * false, signaling the end of the data stream.
 * * **Performance Optimization:**
 * By isolating the `useInView` hook and its subsequent `useEffect` in this
 * small component, we prevent the entire `WorkoutList` or `WorkoutHistory`
 * from re-rendering during high-frequency scroll events.
 * * @param {InfiniteScrollTriggerProps} props - Component properties.
 * @returns {JSX.Element} The visual footer/trigger for the infinite feed.
 */
export const InfiniteScrollTrigger = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: InfiniteScrollTriggerProps) => {
	/** * Intersection Observer Configuration:
	 * We use a 0.1 threshold to trigger the fetch slightly before the element
	 * is fully visible (10%), ensuring a smoother loading experience for the user.
	 */
	const { ref, inView } = useInView({ threshold: 0.1 });

	/** * Pagination Orchestrator:
	 * Monitors the intersection state and fires the fetch callback only if
	 * the sentinel is in view, more data exists, and no fetch is currently active.
	 */
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	return (
		/** * The Sentinel Reference:
		 * Attaching the 'ref' here allows 'react-intersection-observer' to track
		 * this DOM node's visibility relative to the scroll container.
		 */
		<div ref={ref} className="w-full py-12 flex flex-col items-center justify-center gap-2">
			{isFetchingNextPage ? (
				<>
					<Loader2 className="animate-spin text-primary w-4 h-4" />
					<span className="text-[8px] uppercase font-bold tracking-widest opacity-40">Loading previous workouts......</span>
				</>
			) : hasNextPage ? (
				/** * READY TO LOAD:
				 * A minimal, bouncing indicator that acts as the physical trigger.
				 */
				<div className="h-4 w-1 bg-primary/10 rounded-full animate-bounce" />
			) : (
				/** * STREAM EXHAUSTED:
				 * Terminal UI state provided when the database returns no more records.
				 */
				<p className="text-[10px] uppercase font-bold opacity-20 tracking-widest border-t border-primary/5 pt-4 w-full text-center">
					End of training history
				</p>
			)}
		</div>
	);
};
