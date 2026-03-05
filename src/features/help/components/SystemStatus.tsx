import { Activity } from "lucide-react";

export const SystemStatus = () => {
	return (
		<div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-primary/10 mb-6">
			<div className="flex items-center gap-2">
				<Activity size={16} className="text-primary animate-pulse" />
				<span className="text-[10px] font-bold uppercase tracking-widest">System Status</span>
			</div>
			<span className="text-[10px] font-black uppercase text-success">*placeholder*</span>
		</div>
	);
};
