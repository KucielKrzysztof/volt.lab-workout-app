/**
 * @fileoverview Server-Side Entry Point for the Template Editor.
 * Orchestrates the routing and server-side shell for modifying existing
 * training blueprints.
 * @module app/(dashboard)/templates/edit/[id]
 */

import { TemplateEditClientView } from "@/features/templates/components/TemplateEditClientView";

/**
 * EditTemplatePage Server Component.
 * * @description
 * This page acts as the **Isomorphic Bridge** for the template editing flow.
 * While it is rendered on the server, it immediately delegates responsibility
 * to the `TemplateEditClientView` to enable "Instant UI" hydration from the
 * client-side cache.
 * * **Architectural Role:**
 * 1. **Route Orchestration**: Defines the dynamic `[id]` segment for the
 * template calibration workspace.
 * 2. **Zero-CLS Strategy**: Renders the initial server-side shell, allowing
 * the client component to fill the content without layout shifts.
 * 3. **Identity Governance**: Since it resides within the `(dashboard)` group,
 * it is protected by the global Auth Proxy and Cookie-Sync engine.
 * * @returns {Promise<JSX.Element>} The server-rendered shell containing the client-side editor.
 */
export default async function EditTemplatePage() {
	/** * Handoff to Client Orchestrator:
	 * We render the client view without initial server data to prioritize
	 * the existing TanStack Query cache, ensuring 0ms latency for the user
	 * during navigation.
	 */
	return <TemplateEditClientView />;
}
