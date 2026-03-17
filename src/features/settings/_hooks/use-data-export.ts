/**
 * @fileoverview Client-side Orchestrator for Data Portability.
 * Manages the lifecycle of user data extraction, serialization, and browser-triggered downloads.
 * @module features/settings/hooks/useDataExport
 */

import { useState } from "react";
import { exportService } from "@/services/apiExport";
import { createClient } from "@/core/supabase/client";
import { toast } from "sonner";

/**
 * Custom hook to facilitate a comprehensive user data export in JSON format.
 * * @description
 * This hook orchestrates a high-performance data portability protocol:
 * 1. **Data Aggregation**: Invokes the `exportService` to retrieve a strictly typed relational snapshot.
 * 2. **Serialization**: Transforms the payload into a formatted JSON string (MIME: `application/json`).
 * 3. **Memory Management**: Generates a temporary `Blob` and an Object URL to handle large datasets without server-side storage.
 * 4. **DOM Orchestration**: Injects and triggers a transient anchor element to bypass browser-specific download security blocks.
 * 5. **Revocation**: Synchronously purges the Object URL from memory post-download to prevent memory leaks.
 * * @param {string} userId - The unique UUID of the user account targeted for data extraction.
 * * @returns {Object} The data portability interface.
 * @property {Function} exportData - Asynchronous function to initiate the aggregation and download sequence.
 * @property {boolean} isExporting - Reactive state indicator for active network requests or heavy serialization tasks.
 */
export const useDataExport = (userId: string) => {
	const [isExporting, setIsExporting] = useState(false);
	const supabase = createClient();

	/**
	 * Internal handler for the export lifecycle.
	 * Dispatches UX notifications and manages transient DOM side-effects.
	 */
	const exportData = async () => {
		setIsExporting(true);
		const toastId = toast.loading("Aggregating your data...");

		try {
			// Step 1: Privilege-checked data retrieval
			const payload = await exportService.getFullUserExport(supabase, userId);

			// Step 2: Client-side serialization and Blob creation
			const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);

			/** Step 3: Virtual Anchor Injection:
			 * Creating a temporary DOM node to simulate a programmatic click action.
			 */
			const link = document.createElement("a");
			link.href = url;
			link.download = `volt-lab-export-${new Date().toISOString().split("T")[0]}.json`;
			document.body.appendChild(link);
			link.click();

			/** Step 4: Cleanup & Memory Safety:
			 * Removing the node and revoking the URL to free up heap memory.
			 */
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success("Export completed", { id: toastId });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during data aggregation.";

			toast.error("Export failed", {
				id: toastId,
				description: errorMessage,
			});
		} finally {
			setIsExporting(false);
		}
	};

	return { exportData, isExporting };
};
