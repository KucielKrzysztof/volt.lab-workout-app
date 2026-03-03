/**
 * @fileoverview Atomic unit of the Athlete Achievement Feed.
 * Encapsulates the visual presentation and interaction logic for a single
 * personal record entry, serving as the core building block of the Hall of Fame.
 * @module features/analytics/components
 */

import { PersonalRecord } from "@/types/profile";
import { Edit2 } from "lucide-react";

/**
 * Interface defining the properties for the RecordRow component.
 * @interface RecordRowProps
 * @property {PersonalRecord} record - The raw achievement data containing exercise name, weight, and ISO date.
 * @property {Function} onEdit - Callback function to notify the parent orchestrator that this record was selected for modification.
 */
interface RecordRowProps {
	record: PersonalRecord;
	onEdit: (record: PersonalRecord) => void;
}

/**
 * Individual row component representing a singular personal best.
 * * @description
 * This component implements the **"High-Contrast Log Item"** aesthetic. It is designed
 * to be an "Atom" in the Atomic Design hierarchy, focused on delivering high
 * legibility of performance metrics at a glance.
 * * @param {RecordRowProps} props - Component properties.
 * @returns {JSX.Element} A stylized, interactive row for the achievement feed.
 */
export const RecordRow = ({ record, onEdit }: RecordRowProps) => {
	/** * Internal Transformation:
	 * Converts a standard ISO string (YYYY-MM-DD) into a localized dot-separated format (DD.MM.YYYY).
	 * This formatting is performed locally to keep the database model pure.
	 */
	const displayDate = record.date.split("-").reverse().join(".");

	return (
		<div
			onClick={() => onEdit(record)}
			/** * Component Interaction:
			 * 'group' context enables the child Edit icon to respond to parent-level hover.
			 * Transitions: 300ms duration for all visual state changes (border, bg, opacity).
			 */
			className="group flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-white/5 hover:border-primary/40 hover:bg-secondary/20 transition-all cursor-pointer animate-in fade-in slide-in-from-right-4 duration-300"
		>
			{/* ATHLETIC IDENTITY CLUSTER: Temporal context and Movement label */}
			<div className="flex flex-col">
				<span className="text-[9px] uppercase font-bold text-primary tracking-widest mb-0.5">{displayDate}</span>
				<h4 className="font-black uppercase italic text-lg tracking-tighter leading-tight">{record.exercise_name}</h4>
			</div>

			{/* PERFORMANCE METRIC CLUSTER: Strength data and Action Indicator */}
			<div className="flex items-center gap-6">
				<div className="text-right flex flex-col items-end">
					<div className="flex items-baseline gap-1">
						<span className="text-2xl font-black italic tracking-tighter">{record.weight}</span>
						<span className="text-[10px] font-bold text-primary">KG</span>
					</div>
				</div>

				{/* ACTION INDICATOR: Contextual hint for editability */}
				<div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary transition-colors">
					<Edit2 size={14} className="text-primary group-hover:text-black transition-colors" />
				</div>
			</div>
		</div>
	);
};
