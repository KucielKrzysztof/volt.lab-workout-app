/**
 * @fileoverview Control Hub for Workout Recalibration.
 * Provides the interface for switching between session analytics and
 * the active draft sandbox.
 * @module features/workouts/components/details/WorkoutDetailToggleEdit
 */

import { Button } from "@/components/ui/button";
import { Check, Edit2, X } from "lucide-react";

/**
 * @interface WorkoutDetailToggleEditProps
 * @description Logic mapping for the session's command and control interface.
 * @property {boolean} isEditing - Global flag indicating the 'Draft' sandbox state is active.
 * @property {boolean} isSaving - Reactive state reflecting the persistence of the protocol to the database.
 * @property {Function} onStart - Protocol initializer used to enter the recalibration sandbox.
 * @property {Function} onCancel - Action to purge the current draft and revert to standard analytical mode.
 * @property {Function} onSave - Method to commit the recalibrated data strings to the physical database record.
 */
interface WorkoutDetailToggleEditProps {
	isEditing: boolean;
	isSaving: boolean;
	onStart: () => void;
	onCancel: () => void;
	onSave: () => void;
}

/**
 * WorkoutDetailToggleEdit Component.
 * * @description
 * A high-fidelity toggle controller that manages the transitional state
 * of a workout detail record. Features motion-enhanced UI elements and
 * status-aware loading indicators to ensure high-velocity feedback during
 * the synchronization process.
 * * @returns {JSX.Element} The rendered command hub.
 */
export const WorkoutDetailToggleEdit = ({ isEditing, isSaving, onStart, onCancel, onSave }: WorkoutDetailToggleEditProps) => {
	return (
		<div className="flex gap-2 items-center justify-center h-10">
			{isEditing ? (
				// EDIT MODE CONTROLS: Cancel and Commit actions.
				<div className="flex gap-2 animate-in zoom-in-95 fade-in duration-200">
					<Button
						variant="ghost"
						size="sm"
						onClick={onCancel}
						disabled={isSaving}
						className="text-muted-foreground uppercase font-black italic hover:text-foreground"
					>
						<X size={16} className="mr-2" /> Cancel
					</Button>
					<Button
						variant="default"
						size="sm"
						onClick={onSave}
						disabled={isSaving}
						className="uppercase font-black italic shadow-lg shadow-primary/20"
					>
						{isSaving ? (
							<span className="flex items-center">
								<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
								Saving...
							</span>
						) : (
							<>
								<Check size={16} className="mr-2" /> Save
							</>
						)}
					</Button>
				</div>
			) : (
				// READ-ONLY MODE: Primary entry point for calibration.
				<Button
					variant="outline"
					size="sm"
					onClick={onStart}
					className="border-primary/20 uppercase font-black italic hover:bg-primary/5 transition-all animate-in fade-in"
				>
					<Edit2 size={16} className="mr-2" /> Edit Mode
				</Button>
			)}
		</div>
	);
};
