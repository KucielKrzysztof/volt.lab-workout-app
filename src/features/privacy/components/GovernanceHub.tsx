/**
 * @fileoverview Governance Hub Orchestrator.
 * Unifies Privacy Protocol and Terms of Service into a single switchable tabs.
 * @module features/privacy/components/GovernanceHub
 */

"use client";

import { useState } from "react";
import { FileText, Fingerprint } from "lucide-react";
import { PrivacyClientView } from "./PrivacyClientView";
import { cn } from "@/lib/utils";
import { TOSClientView } from "./TOSClientView";
import { GovernanceHeader } from "./GovernanceHeader";

/** * Union type defining the available governance modules within the hub.
 * @typedef {"privacy" | "tos"} ProtocolTab
 */
type ProtocolTab = "privacy" | "tos";

/**
 * GovernanceHub Component.
 * * @description
 * The primary navigational hub for VOLT.LAB's transparency layer. It implements
 * a state-driven Tab System that allows users to toggle between data privacy
 * policies and Terms of Service without losing UI context or triggering full page reloads.
 * * @component_logic
 * 1. **Contextual Header Synchronization**: Dynamically updates the `GovernanceHeader`
 * props based on the `activeTab` state to ensure the title reflects the active protocol.
 * 2. **Tabbed Navigation**: Implements a technical, low-profile navigation bar
 * with high-contrast active states.
 * * @returns {JSX.Element} The orchestrated multi-protocol governance interface.
 */
export const GovernanceHub = () => {
	/** * @state {ProtocolTab} activeTab - Controls the currently visible protocol module. */
	const [activeTab, setActiveTab] = useState<ProtocolTab>("privacy");

	return (
		<div className="w-full max-w-3xl mx-auto space-y-10">
			{/* DYNAMIC HEADER */}
			<GovernanceHeader
				title={activeTab === "privacy" ? "Privacy POLICY" : "Terms of Service"}
				desc={activeTab === "privacy" ? "Diagnostic & Data Governance" : "Legal Framework & Rules"}
			/>

			{/* TAB SELECTOR */}
			<nav className="flex items-center justify-center p-1 bg-secondary/20 border border-primary/10 rounded-sm">
				<button
					onClick={() => setActiveTab("privacy")}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
						activeTab === "privacy" ? "bg-primary text-primary-foreground italic" : "text-muted-foreground hover:text-foreground",
					)}
				>
					<Fingerprint size={14} /> Privacy
				</button>
				<button
					onClick={() => setActiveTab("tos")}
					className={cn(
						"flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
						activeTab === "tos" ? "bg-primary text-primary-foreground italic" : "text-muted-foreground hover:text-foreground",
					)}
				>
					<FileText size={14} /> Terms of Service
				</button>
			</nav>

			{/* CONTENT AREA */}
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
				{activeTab === "privacy" && <PrivacyClientView />}
				{activeTab === "tos" && <TOSClientView />}
			</div>
		</div>
	);
};
