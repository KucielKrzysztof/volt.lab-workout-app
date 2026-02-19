import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExerciseSearchProps {
	value: string;
	onChange: (value: string) => void;
	resultsCount: number;
}

export const ExerciseSearch = ({ value, onChange, resultsCount }: ExerciseSearchProps) => {
	return (
		<div className="sticky w-full top-0 md:top-20 z-40 bg-background/95 backdrop-blur-sm py-4">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search exercises..."
					className=" w-full pl-12 h-14 bg-secondary/10 border-white/5 rounded-2xl focus-visible:ring-primary text-lg"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
			<div className="mt-2 px-2 flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
				<span>Results: {resultsCount}</span>
				{value && (
					<button onClick={() => onChange("")} className="text-primary hover:underline">
						Clear
					</button>
				)}
			</div>
		</div>
	);
};
