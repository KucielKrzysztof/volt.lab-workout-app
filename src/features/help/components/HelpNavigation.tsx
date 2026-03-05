"use client";

import { Card } from "@/components/ui/card";
import { BookOpen, HelpCircle, MessageSquare, ChevronRight  } from "lucide-react";
import Link from "next/link";

export const HelpNavigation = () => {
	const helpLinks = [
		{
			title: "Manual",
			description: "Master the training lifecycle from blueprints to analytics.",
			icon: <BookOpen className="text-primary" size={20} />,
			href: "/dashboard/help/manual",
		},
		{
			title: "FAQ",
			description: "Frequently asked questions and technical assistance.",
			icon: <HelpCircle className="text-primary" size={20} />,
			href: "/dashboard/help/faq",
		},
		{
			title: "Feedback & Bug Reports",
			description: "Help us calibrate the system and report anomalies.",
			icon: <MessageSquare className="text-destructive" size={20} />,
			href: "/dashboard/help/feedback",
		},
	];

	return (
		<nav className="grid gap-3">
			{helpLinks.map((link) => (
				<Link key={link.href} href={link.href} className="group">
					<Card className="p-4 bg-secondary/5 border-primary/10 transition-all hover:bg-secondary/10 hover:border-primary/30 active:scale-[0.98]">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="p-2 rounded-lg bg-background border border-primary/5">{link.icon}</div>
								<div>
									<h3 className="text-sm font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{link.title}</h3>
									<p className="text-[10px] text-muted-foreground uppercase tracking-tight">{link.description}</p>
								</div>
							</div>
							<ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
						</div>
					</Card>
				</Link>
			))}
		</nav>
	);
};
