import NoteSearchTypes from "@constants/NoteSearchTypes";
import MsgType from "@constants/messageTypes";
import { useEffect, useState } from "react";
import useWebviewApiOnMessage from "./useWebViewApiOnMessage";
import { SHOW_MODIFIED_NOTES } from "@constants/Settings";
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
  const noteSearchTypes = [NoteSearchTypes.Created];
  if (showModifiedNotes) {
    noteSearchTypes.push(NoteSearchTypes.Modified);
  }
  return noteSearchTypes;
}

export default useNoteSearchTypes;
