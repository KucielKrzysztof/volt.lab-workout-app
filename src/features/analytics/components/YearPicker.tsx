import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Navigation component to switch between years in the statistics view.
 * Prevents navigation into future years beyond the current one.
 */
export const YearPicker = ({ year, onYearChange }: { year: number; onYearChange: (y: number) => void }) => (
	<div className="flex items-center bg-secondary/30 rounded-lg p-1 border border-white/5">
		<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onYearChange(year - 1)}>
			<ChevronLeft size={16} />
		</Button>
		<span className="px-4 font-mono font-bold text-sm">{year}</span>
		{/* Disable navigation to future years */}
		<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onYearChange(year + 1)} disabled={year >= new Date().getFullYear()}>
			<ChevronRight size={16} />
		</Button>
	</div>
);
