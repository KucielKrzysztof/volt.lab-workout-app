"use client";

import { ClipboardList, Dumbbell, HelpCircle, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import { MoreItem } from "./MoreItem";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/ui/Footer";
import { MoreSection } from "./MoreSection";

export const MoreClientView = () => {
	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
			<header className="text-center">
				<h1 className="text-3xl font-black tracking-tighter italic uppercase">More</h1>
				<p className="text-[10px] text-muted-foreground uppercase tracking-widest">Manage your power</p>
			</header>

			{/* TRENING */}
			<MoreSection desc="Training">
				<MoreItem icon={ClipboardList} label="Workout Templates" href="/templates" />
				<MoreItem icon={Dumbbell} label="Exercises Database" href="/exercises" />
			</MoreSection>

			{/* ACCOUNT*/}
			<MoreSection desc="Account">
				<MoreItem icon={User} label="Profile" href="/profile" />
				<MoreItem icon={Settings} label="Settings" href="/settings" />
				<MoreItem icon={ShieldCheck} label="Privacy & Security" href="/privacy" />
			</MoreSection>

			{/* SYSTEM */}
			<MoreSection desc="System">
				<MoreItem icon={HelpCircle} label="Help & Feedback" href="/help" />
				<Separator className="my-2 bg-white/5" />
				<MoreItem
					icon={LogOut}
					label="Logout"
					variant="danger"
					onClick={() => {
						console.log("logout");
					}}
				/>
			</MoreSection>

			<Footer />
		</div>
	);
};
