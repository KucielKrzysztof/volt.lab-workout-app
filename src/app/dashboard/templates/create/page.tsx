import { TemplateCreator } from "@/features/templates/components/TemplateCreator";

/**
 * Template Creation Page (Server Component).
 * Provides the server-side shell for the interactive workout routine builder.
 * This page follows the standard VOLT.LAB dashboard pattern for consistent layout and routing [cite: 19-02-2026].
 * * @returns {JSX.Element} The rendered shell containing the Client-side TemplateCreator.
 */
export default function CreateTemplatePage() {
	return (
		/**
		 * The TemplateCreator is a Client Component ('use client') that handles
		 * the complex local state management of the routine building process.
		 */
		<TemplateCreator />
	);
}
