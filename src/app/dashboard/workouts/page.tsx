import { WorkoutsClientView } from "@/app/dashboard/workouts/components/WorkoutsClientView";

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

export default function WorkoutsPage() {
	return <WorkoutsClientView workouts={MOCK_WORKOUTS} />;
}
