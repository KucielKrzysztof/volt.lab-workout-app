"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, TrendingUp, Dumbbell, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Feed", href: "/feed", icon: LayoutGrid },
	{ label: "Analytics", href: "/analytics", icon: TrendingUp },
	{ label: "Workouts", href: "/workouts", icon: Dumbbell },
	{ label: "More", href: "/more", icon: MoreHorizontal },
];

export const BottomNav = () => {
	const pathname = usePathname();

	if (pathname === "/") return null;

	return (
		<nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/80 backdrop-blur-md border-t border-border px-6 pb-safe-area-inset-bottom">
			<div className="flex items-center justify-between h-16">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex flex-col items-center justify-center gap-1 transition-colors",
								isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
							)}
						>
							<div
								className={cn(
									"p-2 rounded-xl transition-all",

									isActive && "bg-secondary",
								)}
							>
								<Icon size={22} />
							</div>
							{<span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>}
						</Link>
					);
				})}
			</div>
		</nav>
	);
};
