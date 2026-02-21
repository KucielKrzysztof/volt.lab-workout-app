import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	className?: string;
}

/**
 * Foundation UI component for all error states in the application.
 * - **Interactivity**: Optional retry trigger for recovery flows.
 */
export const ErrorState = ({ title = "System Error", message = "An unexpected error occurred.", onRetry, className }: ErrorStateProps) => {
	return (
		<div
			className={cn("flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 animate-in fade-in zoom-in duration-300", className)}
		>
			<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
				<AlertCircle className="h-10 w-10 text-destructive" />
			</div>
			<div>
				<h2 className="text-xl font-black uppercase tracking-tighter">
					{title.split(" ")[0]} <span className="text-destructive">{title.split(" ")[1] || ""}</span>
				</h2>
				<p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto lowercase">{message}</p>
			</div>
			{onRetry && (
				<Button onClick={onRetry} variant="outline" className="h-12 px-8 uppercase font-bold border-white/10 hover:bg-secondary/20">
					<RefreshCcw className="mr-2 h-4 w-4" /> Try Again
				</Button>
			)}
		</div>
	);
};
