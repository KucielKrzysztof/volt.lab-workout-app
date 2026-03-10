"use client";

import { Calculator, ClipboardList, Dumbbell, HelpCircle, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import { MoreItem } from "./MoreItem";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/ui/Footer";
import { MoreSection } from "./MoreSection";
import { useLogout } from "@/features/auth/_hooks/use-logout";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Main Client-Side View for the "More" (Settings) screen.
 * Acts as a centralized hub for navigation to sub-features like Profile,
 * Settings, and Training Tools.
 * * Features:
 * - Categorized sections (Training, Account, System).
 * - Integration of the logout functionality.
 */
export const MoreClientView = () => {
	const { logout, isLoggingOut } = useLogout();

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
			<PageHeader title="More" subtitle="Manage your power" />

			{/* TRENING */}
			<MoreSection desc="Training">
				<MoreItem icon={ClipboardList} label="Workout Templates" href="/dashboard/templates" />
				<MoreItem icon={Dumbbell} label="Exercises Database" href="/dashboard/exercises" />
				<MoreItem icon={Calculator} label="Strength Calculators" href="/dashboard/calculators" />
			</MoreSection>

			{/* ACCOUNT*/}
			<MoreSection desc="Account">
				<MoreItem icon={User} label="Profile" href="/dashboard/profile" />
				<MoreItem icon={Settings} label="Settings" href="/dashboard/settings" />
				<MoreItem icon={ShieldCheck} label="Privacy" href="/dashboard/privacy" />
			</MoreSection>

			{/* SYSTEM */}
			<MoreSection desc="System">
				<MoreItem icon={HelpCircle} label="Help & Feedback" href="/dashboard/help" />
				<Separator className="my-2 bg-white/5" />
				<MoreItem icon={LogOut} label={isLoggingOut ? "Logging out..." : "Logout"} variant="danger" onClick={logout} />
			</MoreSection>

			<Footer />
		</div>
	);
};
