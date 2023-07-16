import MsgType from "@constants/messageTypes";
import joplin from "api";

export function notifyNoteChanged(panelHandle: string) {
  joplin.views.panels.postMessage(panelHandle, {
    type: MsgType.NoteChanged,
  });
}
