"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, TrendingUp, Dumbbell, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Feed", href: "/dashboard/feed", icon: LayoutGrid },
	{ label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
	{ label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
	{ label: "More", href: "/dashboard/more", icon: MoreHorizontal },
];

/**
 * Mobile-specific Bottom Navigation Bar.
 * * Features:
 * - Positioned: fixed bottom-0 for thumb reachability.
 * - Safe Areas: Utilizes 'pb-safe-area-inset-bottom' for modern mobile displays (notches).
 * - Feedback: Visual indicators for active routes using primary color and secondary backgrounds.
 * - Responsive: Hidden on medium screens (md:hidden) in favor of DesktopNav.
 */
export const BottomNav = () => {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full  bg-background/80 backdrop-blur-md border-t border-border px-6 pb-safe-area-inset-bottom md:hidden">
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
