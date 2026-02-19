import { Separator } from "@/components/ui/separator";
import { WelcomeHeader } from "../../../features/feed/components/WelcomeHeader";
import { RecentWorkouts } from "../../../features/feed/components/RecentWorkouts";
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

/**
 * Feed Page (Main Dashboard).
 * Acts as the primary landing page after authentication.
 * * Features:
 * - Entry animations using Tailwind CSS (animate-in).
 * - Displays a welcome header with the user's name.
 * - Shows a list of recent workouts (currently using mock data).
 */
export default function FeedPage() {
	return (
		<div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 ">
			<Hero />
			<WelcomeHeader name={MOCK_USER.name} />
			<Separator />

			<Separator />
			<RecentWorkouts workouts={MOCK_WORKOUTS} />
		</div>
	);
}
