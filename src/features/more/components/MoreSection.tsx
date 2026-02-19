"use client";

interface MoreSectionProps {
	desc: string;
	children: React.ReactNode;
}

/**
 * Layout wrapper for grouping related MoreItem components.
 * Provides a consistent labeling style for sections (e.g., "ACCOUNT", "SYSTEM").
 * * @param desc - The category name displayed in small, uppercase font.
 * @param children - The list of MoreItems.
 */
export const MoreSection = ({ desc, children }: MoreSectionProps) => {
	return (
		<section className="space-y-3">
			<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">{desc}</p>
			<div className="grid gap-2">{children}</div>
		</section>
	);
};
