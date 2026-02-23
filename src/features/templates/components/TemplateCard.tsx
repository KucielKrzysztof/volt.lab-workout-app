import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutTemplateUI } from "@/types/templates";
import { Play } from "lucide-react";
import { useActiveWorkoutStore } from "@/features/workouts/_hooks/use-active-workout-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const TemplateCard = ({ template }: { template: WorkoutTemplateUI }) => {
	const router = useRouter();

	const startFromTemplate = useActiveWorkoutStore((state) => state.startFromTemplate);
	const isWorkoutActive = useActiveWorkoutStore((state) => !!state.startTime);

	const handleStartWorkout = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isWorkoutActive) {
			toast.error("You already have an active session! Finish it first.");
			return;
		}

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
