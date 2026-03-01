/**
 * @fileoverview Individual routine blueprint visualization component.
 * Provides a high-density preview of a workout template and acts as the primary
 * trigger for initiating active training sessions.
 * @module features/templates/components
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutTemplateUI } from "@/types/templates";
import { Play } from "lucide-react";
import { useActiveWorkoutStore } from "@/features/workouts/_hooks/use-active-workout-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * A highly interactive card component representing a reusable workout routine.
 * * @description
 * This component serves as the "Actionable Preview" of a training blueprint.
 * It distills a complex template into a readable list of exercises and targeted
 * muscle groups, providing a direct "One-Click Start" functionality.
 * * **Key Features:**
 * 1. **Session Conflict Guard**: Intelligently prevents the initiation of new
 * workouts if a global session is already in progress, utilizing the `sonner`
 * notification system for user feedback.
 * 2. **Instant Hydration**: Dispatches the `startFromTemplate` action to the
 * Zustand store, immediately transforming static data into an editable training session.
 * 3. **Volume Preview**: Displays a condensed summary of the suggested sets
 * and reps for every exercise in the routine.
 * 4. **Muscle Group Taxonomy**: Aggregates and displays badges for all muscle
 * groups targeted within the specific template.
 * * @param {Object} props - Component properties.
 * @param {WorkoutTemplateUI} props.template - The UI-ready template object containing unique IDs, exercise lists, and muscle group arrays.
 * @returns {JSX.Element} A themed card featuring routine metadata and session triggers.
 */
export const TemplateCard = ({ template }: { template: WorkoutTemplateUI }) => {
	const router = useRouter();

	/** * Store Integration:
	 * Accesses both the state setter for initializing sessions and the
	 * reactive `startTime` flag to determine if a session is currently running.
	 */
	const startFromTemplate = useActiveWorkoutStore((state) => state.startFromTemplate);
	const isWorkoutActive = useActiveWorkoutStore((state) => !!state.startTime);

	/**
	 * Orchestrates the transition from blueprint to active session.
	 * * @description
	 * 1. **Propagation Control**: Stops event bubbling to prevent accidental triggers in nested layouts.
	 * 2. **Validation**: Checks `isWorkoutActive`. If true, the operation is aborted with a toast notification.
	 * 3. **Hydration**: Populates the global `ActiveWorkoutStore` with the selected template's data.
	 * 4. **Navigation**: Redirects the user to the live tracking workspace.
	 * * @param {React.MouseEvent} e - The mouse event from the Play button trigger.
	 */
	const handleStartWorkout = (e: React.MouseEvent) => {
		e.stopPropagation();

		// Guard Clause: Prevent concurrent active sessions.
		if (isWorkoutActive) {
			toast.error("You already have an active session! Finish it first.");
			return;
		}

		// Transition logic.
		startFromTemplate(template);
		router.push("/dashboard/active-workout");
		toast.success(`Started: ${template.name}`);
	};

	return (
		<Card className="bg-secondary/10 border-primary/10 hover:border-primary/30 transition-all group active:scale-[0.98]">
			<CardHeader className="p-4 pb-2">
				<div className="flex justify-between items-start">
					<CardTitle className="text-xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">
						{template.name}
					</CardTitle>
					<button
						onClick={handleStartWorkout}
						disabled={isWorkoutActive}
						className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
					>
						<Play size={16} fill="currentColor" />
					</button>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0 space-y-4">
				<ul className="space-y-2">
					{template.exercises.map((ex, index) => (
						<li key={index} className="flex justify-between items-center gap-4 text-[11px] font-bold uppercase italic tracking-tight">
							<div className="flex items-center gap-2 overflow-hidden">
								<span className="text-[9px] font-mono opacity-30 shrink-0">{index + 1}.</span>
								<span className="text-foreground/80 truncate">{ex.name}</span>
							</div>
							<span className="text-primary font-mono shrink-0">
								{ex.sets}x{ex.reps}
							</span>
						</li>
					))}
				</ul>

				<div className="flex flex-wrap gap-1">
					{template.muscles.map((m) => (
						<Badge key={m} variant="outline" className="text-[9px] uppercase border-primary/20 bg-primary/5 text-muted-foreground font-bold">
							{m}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
