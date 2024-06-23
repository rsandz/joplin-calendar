import { FILTER_NOTES_BY_NOTEBOOK } from "@constants/Settings";
import joplin from "api";

export interface SearchConstraints {
  // Filter notes that are under the specified notebook.
  notebook?: string;
}

/**
 * Build search constraints to be used when searching for notes.
 */
export async function buildSearchConstraints(): Promise<SearchConstraints> {
  return {
    notebook: await buildNotebookFilter(),
  };
}

async function buildNotebookFilter() {
  const shouldFilterByNotebook = await joplin.settings.value(
    FILTER_NOTES_BY_NOTEBOOK
  );
  if (shouldFilterByNotebook) {
    const folder: any = await joplin.workspace.selectedFolder();
    // Search Query uses notebook title instead of ID
    return folder.title;
  }
  return null;
}
