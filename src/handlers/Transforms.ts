import { camelCase } from "lodash";
import moment from "moment";
import Note from "@constants/Note";

export function removeUserTermFromUserTimes(note: any) {
  note.created_time = note.user_created_time;
  note.updated_time = note.user_updated_time;
  delete note.user_created_time;
  delete note.user_updated_time;
  return note;
}
export function convertSnakeCaseKeysToCamelCase(object: any): Note {
  return Object.entries(object).reduce((newObj, [key, value]) => {
    newObj[camelCase(key)] = value;
    return newObj;
  }, {}) as Note;
}
export function convertEpochDateInNoteToIsoString(note: Note): Note {
  return {
    ...note,
    createdTime: moment(note.createdTime).toISOString(),
    updatedTime: moment(note.updatedTime).toISOString(),
    dueTime: moment(note.dueTime).toISOString(),
  };
}
