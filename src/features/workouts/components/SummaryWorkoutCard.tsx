/**
 * @fileoverview Summary visualization component for historical workout sessions.
 * Provides a high-density, interactive card for the workout history feed,
 * aggregating key performance indicators (KPIs) and muscle group distribution.
 * @module features/workouts/components
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutUI } from "@/types/workouts";
import { Clock, Dumbbell, Zap } from "lucide-react";
import Link from "next/link";

interface SummaryWorkoutCardProps {
	workout: WorkoutUI;
}

/**
 * Renders a compact, information-dense overview of a single completed workout.
 * * @description
 * This component is designed for the "History Feed" view. It acts as a
 * read-only snapshot that allows users to quickly assess their past performance
 * without entering the full detail view. It highlights three primary metrics:
 * duration, total volume, and set count.
 * * **Key Features:**
 * 1. **Metric Aggregation**: Displays total session volume in kilograms and
 * duration in minutes, derived from raw database seconds.
 * 2. **Muscle Group Taxonomy**: Renders dynamic badges for every unique muscle
 * group targeted, allowing for quick visual recognition of training focus.
 * 3. **Interactive Navigation**: Wrapped in a Next.js `Link` for seamless
 * client-side transitions to the detailed `WorkoutDetailView`.
 * * @param {SummaryWorkoutCardProps} props - Component properties.
 * @returns {JSX.Element} A themed card component serving as a navigational entry for workout history.
 */
export const SummaryWorkoutCard = ({ workout }: SummaryWorkoutCardProps) => {
	/** * Destructuring UI-optimized fields.
	 * These fields are pre-calculated during the store hydration or API fetch phase
	 * to ensure the render cycle remains performant.
	 */
	const { name, displayDate, duration_seconds, total_volume, muscles, totalSets } = workout;

	/** * Local Unit Conversion:
	 * Decomposes the raw duration into minutes for dashboard-standard readability.
	 */
	const durationMinutes = Math.floor(duration_seconds / 60);

	return (
		<Link href={`/dashboard/workouts/${workout.id}`} className="block group transition-all active:scale-[0.98]">
			<Card className="bg-secondary/10 border-primary/10 overflow-hidden mb-2 transition-transform hover:border-primary/30 group">
				<CardHeader className="p-4 pb-2">
					<div className="flex justify-between items-start">
						<div>
							{/* Localized date stamp for chronological tracking. */}
							<p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">{displayDate}</p>
							<CardTitle className="text-xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">
								{name}
							</CardTitle>
						</div>
						{/* Visual Progress Indicator:
                            Reserved for future implementation of volume-comparison logic (PR detection).
                        */}
						<Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[10px] font-bold">
							PROGRESS +?%
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="p-4 pt-2">
					{/* KPI Grid: 
                        Displays the 'Holy Trinity' of workout stats in a horizontal layout.
                    */}
					<div className="flex gap-4 mb-4">
						<div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
							<Clock size={14} className="text-primary" />
							{durationMinutes} min
						</div>
						<div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
							<Dumbbell size={14} className="text-primary" />
							{total_volume} kg
						</div>
						<div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase">
							<Zap size={14} className="text-primary" />
							{totalSets} sets
						</div>
					</div>

					{/** * Anatomical Distribution Badges:
					 * Maps the unique 'muscles' array into a collection of compact tags.
					 * Provides instant feedback on which body parts were prioritized.
					 */}
					<div className="flex flex-wrap gap-1">
						{muscles.map((m) => (
							<Badge
								key={m}
								variant="outline"
								className="text-[9px] uppercase border-primary/20 bg-primary/5 text-muted-foreground font-bold tracking-widest"
							>
								{m}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
