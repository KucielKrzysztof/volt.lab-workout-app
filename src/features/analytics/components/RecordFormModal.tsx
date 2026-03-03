/**
 * @fileoverview Personal Record (PR) Management Interface.
 * Orchestrates the creation and modification of athletic achievements
 * within the yearly-partitioned JSONB storage system.
 * @module features/analytics/components
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PersonalRecord } from "@/types/profile";
import { Loader2, Info } from "lucide-react";

/**
 * Interface defining the properties for the RecordFormModal component.
 * @interface RecordFormModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal via Shadcn Dialog.
 * @property {Function} onClose - Callback to reset state and dismiss the interface.
 * @property {Function} onSave - Mutation trigger to persist the record (Add or Update).
 * @property {PersonalRecord | null} initialData - Contextual data for edit mode; null triggers "Create" mode.
 * @property {boolean} isLoading - Global pending state for the background database operation.
 */
interface RecordFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: PersonalRecord, options?: { onSuccess?: () => void }) => void;
	initialData: PersonalRecord | null;
	isLoading: boolean;
}

/**
 * A sophisticated modal orchestrator for managing athlete achievements.
 * * @description
 * This component acts as the **Input Gateway** for the Hall of Fame. It handles
 * the transition between creating new entries and updating existing yearly
 * records.
 * If a user submits a record for an exercise in a year that already contains
 * a value, the previous entry is overwritten to maintain a clean "Best of Year" log.
 * * **UX Features:**
 * 1. **Auto-Hydration**: Syncs internal state with `initialData` for seamless editing.
 * 2. **Temporal Logic**: Defaults to the current ISO date for rapid entry.
 * 3. **Validation**: Enforces required fields (Name, Weight, Date) via native form constraints.
 * * @param {RecordFormModalProps} props - Component properties.
 * @returns {JSX.Element} The rendered modal interface for achievement management.
 */
export const RecordFormModal = ({ isOpen, onClose, onSave, initialData, isLoading }: RecordFormModalProps) => {
	/** * Internal Form State:
	 * Synchronized with the 'PersonalRecord' type system.
	 */
	const [formData, setFormData] = useState<PersonalRecord>({
		exercise_name: "",
		weight: 0,
		date: new Date().toISOString().split("T")[0],
	});

	/** * Hydration Cycle:
	 * Resets the form to initial data when the modal opens in edit mode,
	 * or to a clean slate for new entries.
	 */
	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		} else {
			setFormData({
				exercise_name: "",
				weight: 0,
				date: new Date().toISOString().split("T")[0],
			});
		}
	}, [initialData, isOpen]);

	/** * Form Submission Handler:
	 * Prevents default browser behavior and delegates persistence to the
	 * mutation hook provided via props.
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData, { onSuccess: onClose });
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-black border-white/10 text-white sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
						{initialData ? "Update Achievement" : "New Record"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 pt-4">
					<div className="space-y-4">
						{/* INPUT: EXERCISE IDENTITY */}
						<div className="space-y-1">
							<label className="text-[10px] uppercase font-bold opacity-50">Exercise Name</label>
							<input
								required
								value={formData.exercise_name}
								onChange={(e) => setFormData({ ...formData, exercise_name: e.target.value })}
								className="w-full bg-secondary/20 border border-white/10 rounded-lg p-3 font-bold uppercase transition-colors focus:border-primary/50 outline-none"
								placeholder="e.g. Bench Press"
							/>
						</div>

						{/* INPUT: PERFORMANCE METRICS */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<label className="text-[10px] uppercase font-bold opacity-50">Weight (KG)</label>
								<input
									type="number"
									required
									value={formData.weight || ""}
									onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
									className="w-full bg-secondary/20 border border-white/10 rounded-lg p-3 font-black italic text-xl transition-colors focus:border-primary/50 outline-none"
								/>
							</div>
							<div className="space-y-1">
								<label className="text-[10px] uppercase font-bold opacity-50">Date</label>
								<input
									type="date"
									required
									value={formData.date}
									onChange={(e) => setFormData({ ...formData, date: e.target.value })}
									className="w-full bg-secondary/20 border border-white/10 rounded-lg p-3 text-sm font-mono transition-colors focus:border-primary/50 outline-none"
								/>
							</div>
						</div>
					</div>

					{/* STRATEGIC UX HINT: Explains the yearly overwrite logic */}
					<div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
						<Info className="text-primary shrink-0" size={18} />
						<p className="text-[10px] leading-relaxed text-primary/80 uppercase font-bold">
							Note: Adding a record for the same exercise and year will overwrite the previous entry. Change the date to preserve historical progress.
						</p>
					</div>

					{/* ACTION: PERSISTENCE TRIGGER */}
					<button
						disabled={isLoading}
						className="w-full bg-primary text-black font-black uppercase italic py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
					>
						{isLoading ? <Loader2 className="animate-spin" size={20} /> : "Save Achievement"}
					</button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
