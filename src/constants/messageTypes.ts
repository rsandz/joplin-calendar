/**
 * Types for messages used to communicate between webview and plugin.
 */
export enum MsgType {
  GetNotes,
  OpenNote,
  NoteChanged,
}

export default MsgType;
