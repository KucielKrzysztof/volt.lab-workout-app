"use client";

import { cn } from "@/lib/utils";

interface MuscleGroupFilterProps {
	/** Array of unique muscle group names derived from the dataset. */
	groups: string[];
	/** The currently active filter. Null represents the "All" state. */
	selectedGroup: string | null;
	/** Callback function to update the parent's filter state. */
	onSelect: (group: string | null) => void;
}

/**
 * Horizontal scrollable category selector for Muscle Groups.
 * * Design Features:
 * - **Touch-Optimized**: Uses a scrollable container with hidden scrollbars for a clean mobile-first experience.
 * - **Visual Feedback**: Active states feature the signature primary-colored glow (shadow) for high contrast.
 * * @param {MuscleGroupFilterProps} props - Component properties.
 */
export const MuscleGroupFilter = ({ groups, selectedGroup, onSelect }: MuscleGroupFilterProps) => {
	return (
		<div className="w-full overflow-x-auto no-scrollbar pb-2">
			<div className="flex gap-2">
				{/* Static "All" button to reset the muscle group filter */}
				<button
					onClick={() => onSelect(null)}
					className={cn(
						"px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
						!selectedGroup
							? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,88,12,0.3)]"
							: "bg-secondary/10 text-muted-foreground border-white/5 hover:bg-secondary/20",
					)}
				>
					All
				</button>

				{/* Dynamically rendered muscle group buttons */}
				{groups.map((group) => (
					<button
						key={group}
						onClick={() => onSelect(group)}
						className={cn(
							"px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
							selectedGroup === group
								? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(234,88,12,0.3)]"
								: "bg-secondary/10 text-muted-foreground border-white/5 hover:bg-secondary/20",
						)}
					>
						{group}
					</button>
				))}
			</div>
		</div>
	);
};
