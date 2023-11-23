import joplin from "api";
import MsgType from "@constants/messageTypes";
import moment from "moment";
import {
  getNearestDayWithCreatedNote,
  getNearestDayWithModifiedNote,
} from "./GetNearestDayWithNote";
import {
  getMonthCreatedNoteStatistics,
  getMonthModifiedNoteStatistics,
} from "./GetMonthStatistics";
import {
  getCreatedNotesForDay,
  getModifiedNotesForDay,
} from "./GetNotesForDay";
import NoteSearchTypes from "@constants/NoteSearchTypes";
import MonthStatistics from "@constants/MonthStatistics";
import { GetNearestDayWithNoteResponse } from "@constants/GetNearestDayWithNote";
import { uniqBy } from "lodash";
import { triggerAllSettingsCallbacks } from "../settings";

async function openNote(id: string) {
  joplin.commands.execute("openNote", id);
}

async function handleGetNotes(message) {
  const noteTypes: NoteSearchTypes[] = message.noteSearchTypes
    ? message.noteSearchTypes
    : [NoteSearchTypes.Created];

  if (!message.currentDate) {
    console.error(`Could not process message since missing date.`);
    return null;
  }

  const notes = [];
  if (noteTypes.includes(NoteSearchTypes.Created)) {
    notes.push(
      ...(await getCreatedNotesForDay(
        moment(message.currentDate, moment.ISO_8601)
      ))
    );
  }
  if (noteTypes.includes(NoteSearchTypes.Modified)) {
    notes.push(
      ...(await getModifiedNotesForDay(
        moment(message.currentDate, moment.ISO_8601)
      ))
    );
  }

  const uniqueNotes = uniqBy(notes, (note) => note.id);
  return uniqueNotes;
}

async function handleGetMonthStatistics(message): Promise<MonthStatistics> {
  const noteTypes: NoteSearchTypes[] = message.noteSearchTypes
    ? message.noteSearchTypes
    : [NoteSearchTypes.Created];

  if (!message.date) {
    console.error(`Could not process message since missing date.`);
    return null;
  }

  const individualStatistics: MonthStatistics[] = [];

  if (noteTypes.includes(NoteSearchTypes.Created)) {
    individualStatistics.push(
      await getMonthCreatedNoteStatistics(moment(message.date, moment.ISO_8601))
    );
  }

  if (noteTypes.includes(NoteSearchTypes.Modified)) {
    individualStatistics.push(
      await getMonthModifiedNoteStatistics(
        moment(message.date, moment.ISO_8601)
      )
    );
  }

  return individualStatistics.reduce(
    (prev, curr) => {
      const notesPerDay = prev.notesPerDay;
      Object.entries(curr.notesPerDay).forEach(([key, value]) => {
        if (notesPerDay[key]) {
          notesPerDay[key] += value;
        } else {
          notesPerDay[key] = value;
        }
      });
      return {
        notesPerDay,
      };
    },
    { notesPerDay: {} }
  );
}

async function handleGetNearestDayWithNote(message) {
  const noteTypes: NoteSearchTypes[] = message.noteSearchTypes
    ? message.noteSearchTypes
    : [NoteSearchTypes.Created];

  if (!message.date) {
    console.error(`Could not process message since missing date.`);
    return null;
  }

  const candidateResponses: GetNearestDayWithNoteResponse[] = [];

  if (noteTypes.includes(NoteSearchTypes.Created)) {
    candidateResponses.push(
      await getNearestDayWithCreatedNote(
        moment(message.date, moment.ISO_8601),
        message.direction
      )
    );
  }
  if (noteTypes.includes(NoteSearchTypes.Modified)) {
    candidateResponses.push(
      await getNearestDayWithModifiedNote(
        moment(message.date, moment.ISO_8601),
        message.direction
      )
    );
  }

  return candidateResponses.reduce((prev, curr) => {
    if (!curr) {
      return prev;
    }
    if (!prev) {
      return curr;
    }
    if (message.direction === "future") {
      return curr.date < prev.date ? curr : prev;
    } else {
      return curr.date > prev.date ? curr : prev;
    }
  }, null);
}

/**
 * Handler for all messages coming from our panel webview.
 */
async function handlePanelMessage(message) {
  const msgType = message.type;
  switch (msgType) {
    case MsgType.GetNotes: {
      return await handleGetNotes(message);
    }

    case MsgType.OpenNote: {
      if (!message.id) {
        console.error(`Could not process message since missing id.`);
        return;
      }
      openNote(message.id);
      return;
    }

    case MsgType.GetSelectedNote: {
      return await joplin.workspace.selectedNote();
    }

    case MsgType.GetMonthStatistics: {
      return await handleGetMonthStatistics(message);
    }

    case MsgType.GetNearestDayWithNote: {
      return await handleGetNearestDayWithNote(message);
    }

    case MsgType.TriggerAllSettingsCallbacks: {
      return await triggerAllSettingsCallbacks();
    }

    default: {
      throw new Error(`Could not process message: ${message}`);
    }
  }
}

export default handlePanelMessage;
