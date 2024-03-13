import NoteSearchTypes from "@constants/NoteSearchTypes";
import {
  SHOW_DUE_NOTES,
  SHOW_MODIFIED_NOTES,
  SHOW_RELATED_NOTES,
} from "@constants/Settings";
import useOnSettingsChange from "./useOnSettingsChange";

/**
 * Provides note types to search for when fetching notes, based on user preference.
 *
 * Note type examples: Created Notes, Modified Notes
 */
function useNoteSearchTypes() {
  const showModifiedNotes = useOnSettingsChange<boolean>(
    SHOW_MODIFIED_NOTES,
    false
  );
  const showDueNotes = useOnSettingsChange<boolean>(SHOW_DUE_NOTES, true);
  const showRelatedNotes = useOnSettingsChange<boolean>(
    SHOW_RELATED_NOTES,
    false
  );

  // Default note types to show
  const noteSearchTypes = [NoteSearchTypes.Created];

  if (showModifiedNotes) {
    noteSearchTypes.push(NoteSearchTypes.Modified);
  }
  if (showDueNotes) {
    noteSearchTypes.push(NoteSearchTypes.Due);
  }
  if (showRelatedNotes) {
    noteSearchTypes.push(NoteSearchTypes.Related);
  }
  return noteSearchTypes;
}

export default useNoteSearchTypes;
