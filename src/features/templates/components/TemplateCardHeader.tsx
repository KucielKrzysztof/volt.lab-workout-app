/**
 * @fileoverview Presentational header orchestrator for the TemplateCard.
 * Manages the layout of routine metadata and the specialized action suite
 * (Edit, Start, Delete).
 * @module features/templates/components
 */

import { Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Properties for the TemplateCardHeader component.
 * @interface TemplateCardHeaderProps
 * @property {string} name - The display name of the workout routine.
 * @property {boolean} isDeleting - State flag from the mutation hook to disable interactions.
 * @property {boolean} isWorkoutActive - Global state flag to prevent concurrent sessions.
 * @property {Function} onEdit - Callback to trigger the calibration/edit flow.
 * @property {Function} onStart - Callback to hydrate the store and start a workout.
 * @property {Function} onDelete - Callback to execute the destructive removal mutation.
 */
interface TemplateCardHeaderProps {
	name: string;
	isDeleting: boolean;
	isWorkoutActive: boolean;
	onEdit: () => void;
	onStart: (e: React.MouseEvent) => void;
	onDelete: () => void;
}

/**
 * TemplateCardHeader Component.
 * * @description
 * Implements the **Action Bar Pattern** for workout blueprints. This component
 * centralizes all routine-level triggers while maintaining a high-density,
 * high-contrast visual hierarchy consistent with the VOLT.LAB design system.
 * * **Technical Architecture:**
 * 1. **Encapsulated Deletion Flow**: Integrates Shadcn `AlertDialog` to provide
 * a secure, non-native confirmation modal.
 * 2. **State-Aware UI**: Buttons dynamically toggle their `disabled` state
 * based on pending mutations or active training sessions.
 * 3. **Propagation Control**: Explicitly manages event bubbling to ensure
 * action clicks do not trigger parent-level card interactions.
 * * @param {TemplateCardHeaderProps} props - Component properties.
 * @returns {JSX.Element} The rendered header with title and action suite.
 */
export const TemplateCardHeader = ({ name, isDeleting, isWorkoutActive, onEdit, onStart, onDelete }: TemplateCardHeaderProps) => (
	<div className="flex justify-between items-start">
		{/** * Blueprint Identity:
		 * Renders the routine name with high visual weight.
		 */}
		<CardTitle className="text-xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">{name}</CardTitle>

		{/** * Action Suite:
		 * A horizontally aligned set of triggers for routine management.
		 */}
		<div className="flex gap-2 flex-wrap justify-center">
			{/* EDIT TRIGGER: Navigates to the blueprint calibration workspace */}
			<Button
				variant="outline"
				size="sm"
				onClick={onEdit}
				disabled={isWorkoutActive || isDeleting}
				className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
			>
				<Pencil size={14} />
			</Button>
			{/* START TRIGGER: Hydrates the session store and initiates tracking */}
			<Button
				size="sm"
				onClick={onStart}
				disabled={isWorkoutActive || isDeleting}
				className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
			>
				<Play size={16} fill="currentColor" />
			</Button>
			{/* DESTRUCTIVE ACTION: Encapsulated AlertDialog for routine decommissioning */}
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						disabled={isWorkoutActive || isDeleting}
						onClick={(e) => e.stopPropagation()}
						className="p-2 bg-primary/10 text-primary rounded-full hover:bg-destructive hover:text-destructive-foreground transition-all"
					>
						<Trash2 size={14} />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent className="border-primary/20 bg-background">
					<AlertDialogHeader>
						<AlertDialogTitle className="uppercase font-black italic tracking-tighter text-2xl">
							Decommission <span className="text-destructive">Blueprint</span>?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-zinc-400 font-medium">
							This will permanently remove the <span className="text-foreground">{name}</span> routine.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="border-white/10 bg-white/5 hover:bg-white/10 uppercase font-semibold! tracking-tighter">
							Abort
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={onDelete}
							className="bg-destructive! text-destructive-foreground! hover:opacity-90 uppercase font-semibold! italic tracking-tighter shadow-[0_0_15px_rgba(var(--color-destructive),0.4)]"
						>
							Proceed to Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	</div>
);
