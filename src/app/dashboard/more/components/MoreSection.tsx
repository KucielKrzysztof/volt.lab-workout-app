"use client";

interface MoreSectionProps {
	desc: string;
	children: React.ReactNode;
}

export const MoreSection = ({ desc, children }: MoreSectionProps) => {
	return (
		<section className="space-y-3">
			<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">{desc}</p>
			<div className="grid gap-2">{children}</div>
		</section>
	);
};
