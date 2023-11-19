import NoteSearchTypes from "@constants/NoteSearchTypes";
import MsgType from "@constants/messageTypes";
import { useState } from "react";
import useWebviewApiOnMessage from "./useWebViewApiOnMessage";
import { SHOW_MODIFIED_NOTES } from "@constants/Settings";

/**
 * Provides note types to search for when fetching notes, based on user preference.
 *
 * Note type examples: Created Notes, Modified Notes
 */
function useNoteSearchTypes() {
  const [showModifiedNotes, setShowModifiedNotes] = useState(false);
  const noteSearchTypes = [NoteSearchTypes.Created];
  if (showModifiedNotes) {
    noteSearchTypes.push(NoteSearchTypes.Modified);
  }

  useWebviewApiOnMessage((data) => {
    const message = data.message;

    if (!message.type) {
      return;
    }
    if (message.type !== MsgType.SettingChanged) {
      return;
    }

    const settingMessage = message as any;

    if (settingMessage.key !== SHOW_MODIFIED_NOTES) {
      return;
    }
    setShowModifiedNotes((message as any).value);
  });

  return noteSearchTypes;
}

export default useNoteSearchTypes;
