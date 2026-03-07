/**
 * @fileoverview Technical and tactical knowledge base for VOLT.LAB.
 * Provides answers to common queries regarding data persistence and training logic.
 * @module features/support/components
 */

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Terminal } from "lucide-react";
import { faqs } from "@/features/help/data/faq.data";

/**
 * FaqClientView Component.
 * * @description
 * High-density FAQ interface. Designed to address technical aspects of the
 * laboratory (Sync, Auth, Themes) and training mechanics (Volume, PRs).
 */
export const FaqClientView = () => {
	return (
		<div className="flex flex-col min-h-screen pb-20">
			<PageHeader title="FAQ" subtitle="Frequently ASked Questions" className="mb-6" />

			<main className="px-4">
				<div className="mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3">
					<Terminal size={18} className="text-primary shrink-0 mt-0.5" />
					<p className="text-[10px] text-muted-foreground uppercase leading-relaxed font-bold">
						Welcome to the knowledge base. If your anomaly is not listed below, please proceed to the{" "}
						<span className="text-primary italic">Feedback & Bug Reports</span>.
					</p>
				</div>

				<Accordion type="single" collapsible className="w-full space-y-2">
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={`item-${index}`} className="border border-primary/10 bg-secondary/5 rounded-xl px-4 overflow-hidden">
							<AccordionTrigger className="hover:no-underline py-4 text-left group">
								<div className="flex items-center gap-3 flex-1">
									<HelpCircle size={18} className="shrink-0 text-primary/50 group-hover:text-primary transition-colors group-hover:animate-pulse" />

									<span className="text-xs font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">
										{faq.question}
									</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="text-[11px] leading-relaxed text-muted-foreground uppercase font-medium pb-4 border-t border-primary/5 pt-2">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</main>
		</div>
	);
};
