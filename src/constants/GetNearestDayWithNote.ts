import Note from "./Note";
import MsgType from "./messageTypes";

/**
 * Request body for getting nearest day with note.
 */
export interface GetNearestDayWithNoteRequest {
  type: MsgType.GetNearestDayWithNote;
  date: string;
  direction: "future" | "past";
}

/**
 * Response body for getting nearest day with note.
 */
export interface GetNearestDayWithNoteResponseBody {
  date: string;
  note: Note;
}

export type GetNearestDayWithNoteResponse =
  GetNearestDayWithNoteResponseBody | null;
