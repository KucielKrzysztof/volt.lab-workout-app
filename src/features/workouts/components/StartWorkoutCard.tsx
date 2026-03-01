/**
 * @fileoverview Launchpad component for initiating workout sessions.
 * Refactored to separate visual representation from orchestration logic.
 * Delegating state management to the `useStartWorkoutFlow` hook ensures
 * a clean separation of concerns.
 * @module features/workouts/components
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Play, ClipboardList, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/core/providers/UserProvider";
import { useStartWorkoutFlow } from "../_hooks/use-start-workout-flow";

/**
 * An interactive card component that facilitates the initiation of new workouts.
 * * @description
 * This component acts as the "Launchpad" for training sessions. Following the
 * refactor, it now serves primarily as a UI Orchestrator, consuming state and
 * handlers from the `useStartWorkoutFlow` hook.
 * * **Architectural Role:**
 * - **View Layer**: Renders the card, status headers, and the routine selection sheet.
 * - **Logic Delegation**: Offloads session conflict detection, hydration, and
 * navigation to a specialized business logic hook.
 * * **Key Behavioral Logic (via Hook):**
 * 1. **Active Session Guard**: Disables interaction if a workout is already running.
 * 2. **Contextual Hydration**: Populates the selection sheet with user-specific templates.
 * 3. **Session Handover**: Executes the transition from blueprint to active state.
 * * @returns {JSX.Element} A themed action card with conditional states for active/inactive sessions.
 */
export const StartWorkoutCard = () => {
	/** * User context for scoping routine data fetching. */
	const { user } = useUser();

	/**
	 * Primary Logic Orchestrator.
	 * Consumes the refined workout start flow, decoupling the UI from:
	 * - Template fetching (React Query)
	 * - Session status (Zustand)
	 * - Navigation (Next.js Router)
	 */
	const { templates, isLoading, isWorkoutActive, isSheetOpen, setIsSheetOpen, handleSelectTemplate } = useStartWorkoutFlow(user?.id || "");

	return (
		<Card className="border-primary/20 bg-primary/5 overflow-hidden border-2 border-dashed">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4">
					{/* Dynamic Status Header:
                        Provides clear instructions based on whether a workout is currently running.
                    */}
					<div className="flex justify-between items-start">
						<div className="space-y-1">
							<h3 className="text-xl font-black italic uppercase tracking-tight">Ready to train?</h3>
							<p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
								{isWorkoutActive ? "Finish your current session first" : "Choose how you want to start"}
							</p>
						</div>
						{isWorkoutActive && <AlertCircle className="text-primary animate-pulse" size={20} />}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{/* SELECT ROUTINE TRIGGER:
                            The master trigger for starting a workout. Disabled if a session exists.
                        */}
						<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
							<SheetTrigger asChild>
								<Button
									disabled={isWorkoutActive}
									className="h-14 gap-2 font-bold uppercase tracking-tighter text-lg shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
								>
									<Play className="fill-current" size={20} />
									{isWorkoutActive ? "Session Active" : "Start workout"}
								</Button>
							</SheetTrigger>
							<SheetContent side="bottom" className="h-[70vh] bg-background border-t-primary/20 rounded-t-[2rem]">
								<SheetHeader className="pb-6">
									<SheetTitle className="text-2xl font-black italic uppercase tracking-tighter">Choose Routine</SheetTitle>
								</SheetHeader>

								{/* Routine Selection List:
                                    Renders interactive buttons for each available template. 
                                    Includes a loading state for data transitions.
                                */}
								<div className="space-y-3 overflow-y-auto pb-10">
									{isLoading ? (
										<div className="flex justify-center py-10">
											<Loader2 className="animate-spin text-primary" />
										</div>
									) : (
										templates?.map((template) => (
											<button
												key={template.id}
												onClick={() => handleSelectTemplate(template)}
												className="w-full flex items-center justify-between p-5 bg-secondary/10 border border-primary/5 rounded-2xl hover:border-primary/40 transition-all group text-left active:scale-[0.98]"
											>
												<div>
													<p className="font-black uppercase italic text-lg group-hover:text-primary transition-colors leading-none mb-1">
														{template.name}
													</p>
													<p className="text-[10px] opacity-40 uppercase font-mono tracking-widest">{template.exerciseCount} Exercises</p>
												</div>
												<ChevronRight size={20} className="text-primary/40 group-hover:text-primary transition-colors" />
											</button>
										))
									)}
								</div>
							</SheetContent>
						</Sheet>

						{/* NAVIGATIONAL LINK:
                            Provides quick access to the Template management library.
                        */}
						<Button
							variant="outline"
							disabled={isWorkoutActive}
							className="h-14 gap-2 font-bold uppercase tracking-tighter border-white/10 hover:bg-secondary/20 disabled:opacity-50"
							asChild={!isWorkoutActive} // Prevent Link from being active if disabled
						>
							{isWorkoutActive ? (
								<span className="flex items-center gap-2">
									<ClipboardList size={20} />
									Templates
								</span>
							) : (
								<Link href="/dashboard/templates">
									<ClipboardList size={20} />
									Templates
								</Link>
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
