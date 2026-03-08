/**
 * @fileoverview High-performance Offline Indicator using Shadcn Popover.
 * Leverages Radix Portals to guarantee positioning accuracy.
 */

"use client";

import { WifiOff, Info } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * OfflineIndicator Component.
 * * Automatically monitors uplink status and provides an interactive legend via Popover.
 * * Uses 'destructive' theme for high-visibility warning.
 */
export const OfflineIndicator = () => {
	const isOnline = useOnlineStatus();

	// Kill component if system is online to save resources
	if (isOnline) return null;

	return (
		<div className="fixed top-4 right-4 md:top-auto md:bottom-6 md:right-6 z-50">
			<Popover>
				{/* TRIGGER: The Pulsing Icon */}
				<PopoverTrigger asChild>
					<button
						className={cn(
							"flex items-center justify-center p-3 rounded-full shadow-2xl animate-pulse transition-transform active:scale-90",
							"bg-destructive text-destructive-foreground hover:bg-destructive/90",
						)}
					>
						<WifiOff size={22} className="stroke-[2.5px]" />
					</button>
				</PopoverTrigger>

				{/* CONTENT: The Legend */}
				<PopoverContent side="left" align="center" sideOffset={12} className="w-64 bg-secondary border-border p-4 shadow-2xl rounded-xl z-[10000]">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-destructive">
							<Info size={16} />
							<h4 className="font-black italic uppercase tracking-tighter text-xs">OFFLINE</h4>
						</div>
						<p className="text-[10px] uppercase font-medium tracking-widest leading-relaxed opacity-70">
							The system has lost connection. If any workout is active the data still will be safe.
						</p>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
