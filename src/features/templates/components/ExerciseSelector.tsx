"use client";

import { useState } from "react";
import { useExercises } from "@/features/exercises/_hooks/use-exercise";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExerciseSelectorProps {
	/** Callback triggered when a user selects an exercise from the list [cite: 19-02-2026]. */
	onSelect: (exercise: { id: string; name: string }) => void;
}

export const ExerciseSelector = ({ onSelect }: ExerciseSelectorProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	/** * Data Fetching:
	 * Pulls exercises from the TanStack Query cache or database.
	 */
	const { data: exercises, isLoading } = useExercises();

	/** * Filter Logic:
	 * Simple client-side search to find exercises by name or muscle group [cite: 19-02-2026].
	 */
	const filteredExercises = exercises?.filter(
		(ex) => ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || ex.muscle_group.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleSelect = (ex: { id: string; name: string }) => {
		onSelect(ex);
		setIsOpen(false); // Close sheet after selection
		setSearchTerm(""); // Reset search
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
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
