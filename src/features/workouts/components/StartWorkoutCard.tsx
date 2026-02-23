"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Play, ClipboardList, Loader2, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTemplates } from "@/features/templates/_hooks/use-templates";
import { useUser } from "@/core/providers/UserProvider";
import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { useRouter } from "next/navigation";
import { WorkoutTemplateUI } from "@/types/templates";

export const StartWorkoutCard = () => {
	const { user } = useUser();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	/** * Check Active Session:
	 * We pull startTime to determine if a session is currently running.
	 */
	const startTime = useActiveWorkoutStore((state) => state.startTime);
	const isWorkoutActive = !!startTime;

	const { data: templates, isLoading } = useTemplates(user?.id || "");
	const startFromTemplate = useActiveWorkoutStore((state) => state.startFromTemplate);

	const handleSelectTemplate = async (template: WorkoutTemplateUI) => {
		startFromTemplate(template);
		setOpen(false);
		router.push("/dashboard/active-workout");
	};

	return (
		<Card className="border-primary/20 bg-primary/5 overflow-hidden border-2 border-dashed">
			<CardContent className="p-6">
				<div className="flex flex-col gap-4">
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
						{/* MODAL / SHEET TRIGGER */}
						<Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button
									/** * Disable Logic:
									 * Prevents starting a new workout if one is already in progress.
									 */
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

						{/* LINK DO LISTY TEMPLATE'ÓW */}
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
