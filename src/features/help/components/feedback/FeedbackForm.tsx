/**
 * @fileoverview Presentational component for the Feedback and Bug Report form.
 * Leverages Shadcn UI primitives and the useFeedbackForm hook for state management.
 */

"use client";

import { Bug, Sparkles, TrendingUp, HelpCircle, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFeedbackForm } from "../../_hooks/use-feedback-form";

/**
 * FeedbackForm Component.
 * * * Renders a high-contrast, interactive form for system calibration reports.
 * * Uses Zod-backed validation to ensure all transmitted data meets laboratory standards.
 * * @returns {JSX.Element} The rendered feedback form interface.
 */
export const FeedbackForm = () => {
	/** * Extracts form state and submission handlers from the headless hook.
	 * Decouples UI rendering from business logic.
	 */
	const { form, isPending, onSubmit } = useFeedbackForm();

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-6">
				{/* CATEGORY SELECT */}
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem className="flex flex-col items-center">
							<FormLabel className="font-black italic uppercase tracking-widest text-[10px] ">Category</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger className="bg-secondary/5 font-bold uppercase italic tracking-tighter h-12">
										<SelectValue placeholder="SELECT Category TYPE" />
									</SelectTrigger>
								</FormControl>
								<SelectContent
									className="bg-secondary text-foreground border border-border shadow-xl  overflow-hidden rounded-md"
									style={{ zIndex: 9999 }}
								>
									<SelectItem value="bug" className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
										<div className="flex items-center gap-2 text-destructive">
											<Bug className="w-4 h-4 " />
											<span className="font-bold">BUG / SYSTEM ERROR</span>
										</div>
									</SelectItem>

									<SelectItem value="feature" className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
										<div className="flex items-center gap-2  text-success">
											<Sparkles className="w-4 h-4" />
											<span className="font-bold">NEW FEATURE REQUEST</span>
										</div>
									</SelectItem>

									<SelectItem value="improvement" className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
										<div className="flex items-center gap-2 text-blue-500">
											<TrendingUp className="w-4 h-4" />
											<span className="font-bold">SYSTEM IMPROVEMENT</span>
										</div>
									</SelectItem>

									<SelectItem value="other" className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
										<div className="flex items-center gap-2 opacity-60">
											<HelpCircle className="w-4 h-4" />
											<span className="font-bold">OTHER / GENERAL</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage className="text-[10px] uppercase font-bold italic text-destructive" />
						</FormItem>
					)}
				/>

				{/* TITLE INPUT */}
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-black italic uppercase tracking-widest text-[10px]">Subject</FormLabel>
							<FormControl>
								<Input
									placeholder="E.G. DATA SYNC TIMEOUT"
									{...field}
									className="font-bold uppercase tracking-tighter bg-secondary/5 h-12 focus-visible:ring-primary"
								/>
							</FormControl>
							<FormMessage className="text-[10px] uppercase font-bold italic text-destructive" />
						</FormItem>
					)}
				/>

				{/* DESCRIPTION TEXTAREA */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-black italic uppercase tracking-widest text-[10px]">Details</FormLabel>
							<FormControl>
								<Textarea
									placeholder="DESCRIBE IN DETAIL..."
									className="min-h-[150px] font-medium tracking-tight bg-secondary/5 resize-none focus-visible:ring-primary"
									{...field}
								/>
							</FormControl>
							<FormMessage className="text-[10px] uppercase font-bold italic text-destructive" />
						</FormItem>
					)}
				/>

				{/* SUBMIT BUTTON */}
				<div className="mx-auto text-center">
					<Button
						variant="default"
						type="submit"
						disabled={isPending}
						className=" font-black uppercase italic tracking-widest gap-2 py-8 text-base shadow-lg transition-all active:scale-[0.98] "
					>
						{isPending ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								<span>TRANSMITTING...</span>
							</>
						) : (
							"SUBMIT"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};
