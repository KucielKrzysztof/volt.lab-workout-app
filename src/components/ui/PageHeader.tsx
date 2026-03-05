"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
	children?: React.ReactNode;
	title: string;
	subtitle?: string;
	className?: string;
}

/**
 * PageHeader Component.
 * * @description
 * Main reusable header component for pages in VOLT.LAB
 * Uses the 'cn' utility to merge base laboratory styles with custom overrides.
 */
export const PageHeader = ({ children, title = "Title", subtitle, className }: PageHeaderProps) => {
	return (
		<header className={cn("bg-background/95 backdrop-blur pb-4 pt-2", className)}>
			<div className="flex flex-col items-center gap-4">
				<div className="text-center">
					<h1 className="text-2xl font-black tracking-tighter italic uppercase">{title}</h1>
					{subtitle && <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{subtitle}</p>}
				</div>
				{children}
			</div>
		</header>
	);
};
