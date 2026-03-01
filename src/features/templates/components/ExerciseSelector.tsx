/**
 * @fileoverview Exercise selection interface for routine building and session tracking.
 * Provides a mobile-optimized search and discovery layer for the global exercise library.
 * @module features/exercises/components
 */

"use client";

import { useState } from "react";
import { useExercises } from "@/features/exercises/_hooks/use-exercise";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseSelectorProps {
	/** Callback triggered when a user selects an exercise from the list */
	onSelect: (exercise: { id: string; name: string }) => void;
}

/**
 * A bottom-sheet component for browsing and selecting exercises from the database.
 * * @description
 * This component acts as the primary gateway to the application's exercise library.
 * It handles the asynchronous retrieval of movements and provides a high-performance
 * client-side search mechanism.
 * * **Core Features:**
 * 1. **Reactive Data Integration**: Hooks into `useExercises` to consume cached
 * data from TanStack Query, ensuring zero redundant network calls if the library is already loaded.
 * 2. **Multi-Column Search**: Implements a real-time filter that scans both
 * exercise names and muscle group taxonomies (e.g., searching "Chest" will find "Bench Press").
 * 3. **Mobile-First UX**: Utilizes a bottom-anchored `Sheet` for ergonomic one-handed
 * use on mobile devices during training.
 * 4. **State Cleanup**: Automatically resets search terms and closes the drawer
 * upon successful selection to maintain a clean interaction flow.
 * * @param {ExerciseSelectorProps} props - Component properties.
 * @returns {JSX.Element} A themed trigger button and an overlay containing the searchable list.
 */
export const ExerciseSelector = ({ onSelect }: ExerciseSelectorProps) => {
	/** * UI Visibility State:
	 * Manages the open/closed status of the Radix-based Sheet component.
	 */
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	/** * Data Fetching:
	 * Pulls exercises from the TanStack Query cache or database.
	 */
	const { data: exercises, isLoading } = useExercises();

	/** * High-Performance Client-Side Filtering:
	 * * @description
	 * Dynamically filters the exercise library based on the current search term.
	 * Case-insensitive matching is applied to both the name and muscle group fields [cite: 19-02-2026].
	 */
	const filteredExercises = exercises?.filter(
		(ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || ex.muscle_group.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	/**
	 * Internal handler for exercise selection.
	 * * @description
	 * Encapsulates the cleanup logic required after a user makes a choice:
	 * 1. Dispatching the exercise data to the parent.
	 * 2. Closing the drawer.
	 * 3. Wiping the search cache.
	 * @param {Object} ex - Selected exercise data.
	 */
	const handleSelect = (ex: { id: string; name: string }) => {
		onSelect(ex);
		setIsOpen(false);
		setSearchTerm("");
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			{/* The Trigger: A compact button optimized for row-based layouts. */}
			<SheetTrigger asChild>
				<Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-black border-primary/20 hover:bg-primary/5 transition-all">
					<Plus className="mr-1 h-3 w-3" /> Add Exercise
				</Button>
			</SheetTrigger>
			<SheetContent side="bottom" className="h-[80vh] bg-background border-t-primary/20 rounded-t-[2rem]">
				<SheetHeader className="pb-4">
					<SheetTitle className="text-2xl font-black italic uppercase tracking-tighter">Select Exercise</SheetTitle>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
						<Input
							placeholder="Search by name or muscle..."
							className="pl-10 bg-secondary/20 border-primary/10"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</SheetHeader>

				{/* Scrolled Result Area:
                    Handles loading states and iterative rendering of exercise results.
                */}
				<div className="overflow-y-auto h-full pb-20 space-y-2">
					{isLoading ? (
						<p className="text-center py-10 animate-pulse text-[10px] uppercase font-bold opacity-30">Accessing Database...</p>
					) : (
						filteredExercises?.map((ex) => (
							<button
								key={ex.id}
								onClick={() => handleSelect({ id: ex.id, name: ex.name })}
								className="w-full flex justify-between items-center p-4 bg-secondary/5 border border-primary/5 rounded-xl hover:border-primary/40 active:scale-[0.98] transition-all group"
							>
								<div className="text-left">
									<p className="font-bold uppercase italic text-sm group-hover:text-primary transition-colors">{ex.name}</p>
									<Badge variant="outline" className="text-[8px] uppercase font-bold opacity-50">
										{ex.muscle_group}
									</Badge>
								</div>
								<Plus size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
							</button>
						))
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
};
