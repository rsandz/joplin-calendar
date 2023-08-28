/**
 * Types for messages used to communicate between webview and plugin.
 */
export enum MsgType {
  GetNotes,
  GetSelectedNote,
  GetMonthStatistics,
  GetNearestDayWithNote,
  OpenNote,
  NoteChanged,
}

export default MsgType;
