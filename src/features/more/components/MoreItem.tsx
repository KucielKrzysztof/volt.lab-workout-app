import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface MoreItemProps {
	icon: React.ElementType;
	label: string;
	href?: string;
	onClick?: () => void;
	variant?: "default" | "danger";
}

/**
 * Reusable list item component for settings and navigation.
 * * Capabilities:
 * - Polymorphism: Renders as a Next.js <Link> if 'href' is provided,
 * or a <button> if 'onClick' is provided.
 * - Variants: Supports a 'danger' style for destructive actions like Logout.
 * - Feedback: Includes a scale-down effect on press for mobile-first feel.
 * * @param icon - Lucide icon component to display on the left.
 * @param label - Text label for the item.
 * @param variant - Visual style (default or danger).
 */
export const MoreItem = ({ icon: Icon, label, href, onClick, variant = "default" }: MoreItemProps) => {
	const content = (
		<div
			className={cn(
				"flex items-center justify-between p-4 rounded-xl transition-all active:scale-[0.98]",
				"bg-secondary/10 border border-white/5 hover:bg-secondary/20",
				variant === "danger" && "hover:bg-destructive/10 border-destructive/10",
			)}
		>
			<div className="flex items-center gap-4">
				<div className={cn("p-2 rounded-lg bg-background border border-white/5", variant === "danger" ? "text-destructive" : "text-primary")}>
					<Icon size={20} />
				</div>
				<span className={cn("font-bold tracking-tight uppercase text-sm", variant === "danger" ? "text-destructive" : "text-foreground")}>
					{label}
				</span>
			</div>
			<ChevronRight size={18} className="text-muted-foreground opacity-50" />
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{content}
			</Link>
		);
	}

	return (
		<button onClick={onClick} className="w-full text-left">
			{content}
		</button>
	);
};
