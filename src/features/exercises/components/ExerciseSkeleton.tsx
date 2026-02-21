import { Skeleton } from "@/components/ui/skeleton";

/**
 * Individual loading placeholder for an exercise item.
 * Mimics the 'ExerciseListItem' layout to ensure visual stability during hydration.
 */
export const ExerciseSkeleton = () => {
	return (
		<div className="w-full flex items-center justify-between p-4 bg-secondary/5 border border-white/5 rounded-2xl animate-pulse">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10 rounded-lg bg-secondary/20" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-32 bg-secondary/20" />
					<Skeleton className="h-3 w-16 bg-secondary/20" />
				</div>
			</div>
		</div>
	);
};

/**
 * Renders a list of exercise skeletons.
 * Used as a placeholder while the exercise library data is being fetched.
 */
export const ExerciseListSkeleton = () => (
	<div className="grid gap-3">
		{[...Array(12)].map((_, i) => (
			<ExerciseSkeleton key={i} />
		))}
	</div>
);
