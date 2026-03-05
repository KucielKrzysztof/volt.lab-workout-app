/**
 * @fileoverview Summary visualization component for historical workout sessions.
 * Provides a high-density, interactive card for the workout history feed,
 * aggregating key performance indicators (KPIs) and muscle group distribution.
 * @module features/workouts/components
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/core/providers/UserProvider";
import { WorkoutUI } from "@/types/workouts";
import { Clock, Dumbbell, Loader2, Zap } from "lucide-react";
import { useDeleteWorkout } from "../_hooks/use-delete-workout";
import { useRouter } from "next/navigation";
import { DeleteWorkoutDialog } from "./DeleteWorkoutDialog";

interface SummaryWorkoutCardProps {
	workout: WorkoutUI;
}

/**
 * Renders a compact, information-dense overview of a single completed workout.
 * * @description
 * Renders a compact, information-dense overview of a single completed workout.
 * It acts as a navigational entry point that allows users to assess past performance
 * through aggregated metrics before diving into detailed logs.
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
	const router = useRouter();
	const { user } = useUser();

	/** * Deletion Mutation:
	 * Dispatches the 'purge' command to the laboratory archives.
	 * DB-level cascade handles the destruction of associated exercise sets.
	 */
	const { mutate: deleteWorkout, isPending: isDeleting } = useDeleteWorkout(user?.id ?? "");

	/** * Destructuring UI-optimized fields.
	 * These fields are pre-calculated during the store hydration or API fetch phase
	 * to ensure the render cycle remains performant.
	 */
	const { id, name, displayDate, duration_seconds, total_volume, muscles, totalSets } = workout;

	/** * Local Unit Conversion:
	 * Decomposes the raw duration into minutes for dashboard-standard readability.
	 */
	const durationMinutes = Math.floor(duration_seconds / 60);

	/**
	 * Navigates to the detailed workout analysis workspace.
	 * @description This handler is attached to the card shell. Interactions with
	 * the 'Delete' button must call e.stopPropagation() to prevent this fire.
	 */
	const handleCardClick = () => {
		router.push(`/dashboard/workouts/${id}`);
	};

	return (
		<div className="relative mb-3 group">
			{/* DELETION OVERLAY: Blocks interaction while purging data */}
			{isDeleting && (
				<div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-xl border border-destructive/20">
					<div className="flex items-center gap-2">
						<Loader2 className="w-4 h-4 animate-spin text-destructive" />
						<span className="text-[10px] font-black uppercase tracking-widest text-destructive">Deleting Session...</span>
					</div>
				</div>
			)}

			{/* CARD SHELL:
                Programmatic link container. We use a div + onClick instead of <Link> 
                to maintain surgical control over event propagation for nested actions.
            */}
			<div onClick={handleCardClick} className="block group transition-all active:scale-[0.98]">
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
							{/* DECOMMISSIONING TRIGGER:
                                Isolated sub-component with internal propagation guards.
                            */}
							<DeleteWorkoutDialog workoutId={id} workoutName={name} onDelete={deleteWorkout} />
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
			</div>
		</div>
	);
};
