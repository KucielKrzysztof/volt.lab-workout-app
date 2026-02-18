"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, LayoutGrid, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const navItems = [
	{ label: "Feed", href: "/dashboard/feed", icon: LayoutGrid },
	{ label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
	{ label: "Workouts", href: "/dashboard/workouts", icon: Dumbbell },
];

export const DesktopNav = () => {
	const pathname = usePathname();

	return (
		<nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/60 backdrop-blur-xl z-[100] items-center">
			<div className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between">
				{/* LOGO */}
				<Link href="/" className="flex items-center gap-2 group">
					<div className="">
						<Logo size={35} />
					</div>
					<span className="font-black italic tracking-tighter text-xl text-foreground">
						VOLT.<span className="text-primary">LAB</span>
					</span>
				</Link>

				{/* NAV LINKS */}
				<div className="flex items-center gap-1">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
									isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-secondary/20",
								)}
							>
								<Icon size={16} />
								{item.label}

								{/* Active link identifier */}
								{isActive && <div className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#EA580C]" />}
							</Link>
						);
					})}
				</div>

				{/* USER QUICK ACTIONS */}
				<div className="flex items-center gap-4">
					<div className="h-8 w-[1px] bg-white/5 mx-2" />
					<Link
						href="/dashboard/more"
						className="h-8 w-8 rounded-full bg-secondary border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors"
					>
						<span className="text-[10px] font-black">KK</span>
					</Link>
				</div>
			</div>
		</nav>
	);
};
