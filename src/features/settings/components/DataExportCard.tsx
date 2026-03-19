/**
 * @fileoverview Data Portability UI Component.
 * Provides a localized entry point for users to trigger the full account data export.
 * @module features/settings/components/DataExportCard
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useDataExport } from "../_hooks/use-data-export";

/**
 * @interface DataExportCardProps
 * @description Contract for the data portability interface.
 * @property {string} userId - The unique UUID of the user for whom the data is being exported.
 */
interface DataExportCardProps {
	userId: string;
}

/**
 * DataExportCard Component.
 * * @description
 * Renders a specialized configuration card within the Settings domain.
 * It serves as the primary UI trigger for the 'Portability Engine',
 * allowing users to download their entire training history and profile
 * metadata in a standardized JSON format.
 * * **Implementation Details:**
 * 1. **Guard Logic**: Prevents rendering if a valid `userId` is not provided.
 * 2. **State Integration**: Connects to the `useDataExport` hook to handle
 * the asynchronous aggregation and browser-side file generation.
 * 3. **Feedback Mechanism**: Dynamically updates the button label and
 * disabled state during active export operations.
 * * @param {DataExportCardProps} props - Component properties.
 * @returns {JSX.Element | null} The rendered portability card or null if unauthorized.
 */
export const DataExportCard = ({ userId }: DataExportCardProps) => {
	/** * Hook Integration:
	 * Manages the network requests to Supabase and the client-side Blob generation.
	 */
	const { exportData, isExporting } = useDataExport(userId);

	// Identity Guard: Ensures export is bound to a verified user session
	if (!userId) return null;

	return (
		<Card className="p-4 bg-secondary/10 border-white/5 flex justify-between items-center">
			<div className="space-y-0.5">
				<p className="font-bold uppercase italic text-sm tracking-tighter">Portability Engine</p>
				<p className="text-[10px] text-muted-foreground uppercase font-medium">Download your entire training data (JSON)</p>
			</div>
			<Button variant="outline" size="sm" onClick={exportData} disabled={isExporting} className="gap-2 font-bold italic uppercase">
				<Download size={14} />
				{isExporting ? "Exporting..." : "Download"}
			</Button>
		</Card>
	);
};
