import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, ClipboardList } from "lucide-react";

/**
 * Call-to-Action card for starting a new workout.
 * CURRENTLY: JUST UI
 */
export const StartWorkoutCard = () => {
	return (
		<Card className="border-primary/20 bg-primary/5 overflow-hidden border-2 border-dashed">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4">
					<div className="space-y-1">
						<h3 className="text-xl font-black italic uppercase tracking-tight">Ready to train?</h3>
						<p className="text-muted-foreground text-xs uppercase tracking-widest">Choose how you want to start</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<Button className="h-14 gap-2 font-bold uppercase tracking-tighter text-lg shadow-lg shadow-primary/20">
							<Play className="fill-current" size={20} />
							Start workout
						</Button>
						<Button variant="outline" className="h-14 gap-2 font-bold uppercase tracking-tighter border-white/10 hover:bg-secondary/20">
							<ClipboardList size={20} />
							Templates
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
