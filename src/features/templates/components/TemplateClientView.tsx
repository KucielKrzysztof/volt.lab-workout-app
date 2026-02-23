"use client";

import { useUser } from "@/core/providers/UserProvider";
import { useTemplates } from "../_hooks/use-templates";
import { WorkoutTemplateUI } from "@/types/templates";
import { TemplateList } from "./TemplateList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface TemplatesClientViewProps {
	initialTemplates: WorkoutTemplateUI[];
}

export const TemplatesClientView = ({ initialTemplates }: TemplatesClientViewProps) => {
	const { user } = useUser();

	/** * TanStack Query Hydration:
	 * Hooks into the server-prefetched data for instant display.
	 */
	const { data: templates } = useTemplates(user?.id || "", initialTemplates);

	return (
		<div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<header className="flex justify-between items-end">
				<div className="mx-auto">
					<h1 className="text-2xl font-black tracking-tighter italic uppercase">My Routines</h1>
					<p className="text-[10px] opacity-40 uppercase font-mono tracking-widest">Total Blueprints: {templates?.length || 0}</p>
				</div>
			</header>

			<div className="mx-auto">
				<Button size="lg" asChild className="bg-primary text-primary-foreground font-black uppercase italic tracking-widest">
					<Link href="/dashboard/templates/create">
						<Plus className="mr-2 h-4 w-4" /> Create New
					</Link>
				</Button>
			</div>
			<TemplateList templates={templates || []} />
		</div>
	);
};
