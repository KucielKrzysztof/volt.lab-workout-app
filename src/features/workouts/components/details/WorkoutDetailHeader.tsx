/**
 * @fileoverview Workout Session Identity Layer.
 * Provides navigational context and chronological metadata for individual
 * training records.
 * @module features/workouts/components/details/WorkoutDetailHeader
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/**
 * @interface WorkoutDetailHeaderProps
 * @description Logic mapping for the session's identification header.
 * @property {string} workoutName - The user-defined label for the workout protocol.
 * @property {string} startedAt - ISO timestamp used for chronological calibration.
 */
interface WorkoutDetialHeader {
	workoutName: string;
	startedAt: string;
}

/**
 * WorkoutDetailHeader Component.
 * * @description
 * Acts as the primary "Entry Point" for session analytics.
 * Orchestrates the navigation uplink back to the history feed and renders
 * the session's identity using the polymorphic PageHeader primitive.
 * * @returns {JSX.Element} The rendered identity hub.
 */
export const WorkoutDetailHeader = ({ workoutName, startedAt }: WorkoutDetialHeader) => {
	return (
		<div className="flex items-center gap-4 justify-between">
			<Link href="/dashboard/workouts" className="p-2 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-colors justify-self-start">
				<ChevronLeft size={20} />
			</Link>
			<div>
				<PageHeader title={workoutName}>
					<p className="text-muted-foreground text-xs uppercase font-mono tracking-widest">{new Date(startedAt).toLocaleDateString("pl-PL")}</p>
				</PageHeader>
			</div>
			<div className="w-10" aria-hidden="true" />
		</div>
	);
};
