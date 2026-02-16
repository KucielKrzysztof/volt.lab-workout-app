import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Dumbbell } from "lucide-react";

interface SummaryWorkoutCardProps {
	title: string;
	date: string;
	duration: number;
	volume: string;
	muscles: string[];
}

export const SummaryWorkoutCard = ({ title, date, duration, volume, muscles }: SummaryWorkoutCardProps) => {
	return (
		<Card className="bg-secondary/10 border-primary/10 overflow-hidden mb-4 active:scale-[0.98] transition-transform">
			<CardHeader className="p-4 pb-2">
				<div className="flex justify-between items-start">
					<div>
						<p className="text-[10px] text-muted-foreground uppercase tracking-widest">{date}</p>
						<CardTitle className="text-xl font-bold">{title}</CardTitle>
					</div>
					<Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[10px]">
						PROGRESS +5%
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0">
				<div className="flex gap-4 mt-2">
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<Clock size={14} className="text-primary" />
						{duration}
						{" min"}
					</div>
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<Dumbbell size={14} className="text-primary" />
						{volume} kg
					</div>
				</div>
				<div className="flex gap-1 mt-4">
					{muscles.map((m) => (
						<Badge key={m} variant="outline" className="text-[9px] uppercase border-primary/30">
							{m}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
