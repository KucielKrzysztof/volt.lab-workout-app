import { getTemplatesServer } from "@/features/templates/api/get-templates-severt";
import { TemplatesClientView } from "@/features/templates/components/TemplateClientView";
/**
 * Templates Page (Server Component).
 * Fetches initial workout routines on the server to ensure high performance
 */
export default async function TemplatesPage() {
	/** * Initial Data Fetch:
	 * Retrieves mapped templates for the current authenticated user.
	 */
	const initialTemplates = await getTemplatesServer();

	// TODO: ADD EDIT and REMOVE TEMPLATES BUTTONS
	return <TemplatesClientView initialTemplates={initialTemplates} />;
}
