import { Separator } from "@/components/ui/separator";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { RecentWorkouts } from "./components/RecentWorkouts";
import { Hero } from "@/components/ui/Hero";

const MOCK_USER = { name: "Krzysztof" };

const MOCK_WORKOUTS = [
	{
		id: "1",
		title: "Push Day - Chest/Triceps",
		date: "2026-02-15",
		duration: 65,
		volume: "4,250",
		exercises: ["Benchpress", "Incline Dumbbell Press", "Tricpes Extensions", "Lateral Rises"],
		muscles: ["Chest", "Shoulders", "Triceps"],
	},
	{
		id: "2",
		title: "Pull Day - Back/Biceps",
		date: "2026-02-16",
		duration: 50,
		volume: "3,800",
		exercises: ["Pullups", "Dumbbell row", "Biceps curls", "Rear Delt Flys"],
		muscles: ["Back", "Biceps", "Rear Delts"],
	},
];

export default function FeedPage() {
	return (
		<div className="flex flex-col items-center">
			<Hero />
			<WelcomeHeader name={MOCK_USER.name} />
			<Separator />

			<Separator />
			<RecentWorkouts workouts={MOCK_WORKOUTS} />
		</div>
	);
}
