/**
 * @fileoverview Records Visualization Orchestrator.
 * Handles the logic for temporal data slicing and coordinates the rendering
 * of the yearly-partitioned achievement feed.
 * @module features/analytics/components
 */

import { useMemo } from "react";
import { PersonalRecord } from "@/types/profile";
import { Trophy } from "lucide-react";
import { RecordRow } from "../RecordRow";

interface RecordsSectionProps {
	records: PersonalRecord[];
	year: number;
	onEdit: (record: PersonalRecord) => void;
	showTitle?: boolean;
}

/**
 * Orchestrator for the paginated achievement feed.
 * * @description
 * This component acts as a **Smart Container** for personal bests. It is responsible for
 * filtering the raw record array into a yearly-scoped stream.
 * * **Architectural Responsibilities:**
 * 1. **Memoized Temporal Slicing**: Optimized filtering logic to prevent expensive
 * array operations on every render cycle.
 * 2. **State Transition**: Manages the switch between the interactive list and
 * a motivational "Empty State" fallback.
 * 3. **Composition**: Orchestrates the layout of atomic `RecordRow` units.
 * * @param {RecordsSectionProps} props - Component properties.
 * @returns {JSX.Element} The rendered achievement section or a dashed empty state placeholder.
 */
export const RecordsSection = ({ records, year, onEdit, showTitle = false }: RecordsSectionProps) => {
	/** * Memoized Filtering Logic:
	 * This ensures that the array filter only runs when 'records' or 'year' changes.
	 * Prevents performance degradation during parent-level re-renders.
	 */
	const filteredRecords = useMemo(() => {
		return records?.filter((r) => r.date.startsWith(year.toString())) || [];
	}, [records, year]);

	return (
		<div className="space-y-4 w-full">
			{/* SECTION HEADER */}
			{showTitle && (
				<div className="flex items-center justify-center gap-2 px-1">
					<Trophy className="text-primary h-5 w-5" />
					<h3 className="font-black uppercase italic tracking-tighter">Hall of Fame</h3>
				</div>
			)}

			<p className="text-center text-muted-foreground italic text-[10px] uppercase tracking-widest opacity-40">{`Strength Registry for ${year}`}</p>

			{/* RECORDS  */}
			<div className="flex flex-col gap-2 w-full">
				{filteredRecords.length > 0 ? (
					filteredRecords.map((pr) => <RecordRow key={`${pr.exercise_name}-${pr.date}`} record={pr} onEdit={onEdit} />)
				) : (
					<div className="p-12 rounded-2xl border border-dashed border-white/10 text-center animate-in zoom-in duration-500">
						<p className="text-xs text-muted-foreground lowercase italic">No records established in {year}.</p>
					</div>
				)}
			</div>
		</div>
	);
};
