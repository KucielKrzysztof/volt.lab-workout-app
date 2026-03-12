/**
 * @fileoverview Reusable Header Primitive for Governance and Legal Modules.
 * Provides a high-contrast, standardized structural anchor for protocol
 * documentation within the workstation.
 * @module features/privacy/components/GovernanceHeader
 */

import { FileText } from "lucide-react";

/**
 * Interface for the GovernanceHeader component.
 * @interface GovernanceHeaderProps
 * @property {string} title - The primary protocol name (e.g., "Privacy Policy").
 * @property {string} desc - Technical description or versioning metadata.
 */
interface GovernanceHeaderProps {
	title: string;
	desc: string;
}

/**
 * GovernanceHeader Component.
 * * @description
 * Implements the visual standard for Privacy feature headers.
 * * @param {GovernanceHeaderProps} props - Component properties.
 * @returns {JSX.Element} The rendered diagnostic header.
 */
export const GovernanceHeader = ({ title, desc }: GovernanceHeaderProps) => {
	return (
		<header className="space-y-2 border-b border-primary/10 pb-6">
			<div className="flex items-center gap-3">
				<FileText className="text-primary" />
				<h1 className="text-3xl font-black italic uppercase tracking-tighter">{title}</h1>
			</div>
			<p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">{desc}</p>
		</header>
	);
};
