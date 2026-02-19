import { BottomNav } from "@/features/navigation/components/BottomNav";
import { DesktopNav } from "@/features/navigation/components/DesktopNav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col">
			<DesktopNav />
			<main className="flex-1 w-full  mx-auto max-w-lg p-4 pb-24 md:pt-24">{children}</main>
			<BottomNav />
		</div>
	);
}
