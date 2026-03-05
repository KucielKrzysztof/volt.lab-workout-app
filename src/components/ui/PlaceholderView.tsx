/**
 * @fileoverview Universal Placeholder View for the VOLT.LAB ecosystem.
 * Used for modules currently under construction or calibration.
 */

import { HardHat, Construction, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PlaceholderViewProps {
	title?: string;
	description?: string;
}

/**
 * PlaceholderView Component.
 * * @description
 * Renders a high-contrast, branded "Work in Progress" screen.
 * Features a subtle pulse animation on the icon to simulate "active construction".
 */
export const PlaceholderView = ({ title = "Module Under Construction" }: PlaceholderViewProps) => {
	return (
		<div className="relative flex flex-col items-center justify-center min-h-[60vh] p-6 animate-in fade-in zoom-in duration-500 z-50">
			{/* Background Decor */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none select-none" style={{ opacity: 0.05 }}>
				<Construction size={120} className="text-secondary" />
			</div>
			<Card className="max-w-md w-full bg-secondary/10 border-primary/10 border-dashed border-2 relative overflow-hidden">
				<CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full " />
						<div className="relative bg-background p-4 rounded-2xl border border-primary/20">
							<HardHat className="w-12 h-12 text-" />
						</div>
					</div>

					<div className="space-y-2">
						<h2 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h2>
					</div>

					{/* Text with pulsing dot */}
					<div className="mt-8 flex items-center gap-2 opacity-30">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
						</span>
						<span className="text-[9px] font-mono uppercase tracking-[0.3em]">Status: Work in Progress</span>
					</div>

					<Button asChild variant="outline" className="group font-black uppercase italic tracking-widest text-[10px] gap-2">
						<Link href="/dashboard/feed">
							<ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
							Back to Command Center
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
