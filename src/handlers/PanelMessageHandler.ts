import joplin from "api";
import MsgType from "@constants/messageTypes";
import moment from "moment";
import {
  getNearestDayWithCreatedNote,
  getNearestDayWithModifiedNote,
  getNearestDayWithRelatedNote,
} from "./search/GetNearestDayWithNote";
import {
  getMonthCreatedNoteStatistics,
  getMonthModifiedNoteStatistics,
  getMonthRelatedNoteStatistics,
} from "./search/GetMonthStatistics";
import {
  getCreatedNotesForDay,
  getModifiedNotesForDay,
  getRelatedNotesForDay,
} from "./search/GetNotesForDay";
import NoteSearchTypes from "@constants/NoteSearchTypes";
import MonthStatistics from "@constants/MonthStatistics";
import { GetNearestDayWithNoteResponse } from "@constants/GetNearestDayWithNote";
import { uniqBy } from "lodash";
import { triggerAllSettingsCallbacks } from "../settings";
import { buildSearchConstraints } from "./search/SearchConstraints";

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

  const searchConstraints = await buildSearchConstraints();

  const notes = [];
  if (noteTypes.includes(NoteSearchTypes.Created)) {
    notes.push(
      ...(await getCreatedNotesForDay(
        moment(message.currentDate, moment.ISO_8601),
        searchConstraints
      ))
    );
  }
  if (noteTypes.includes(NoteSearchTypes.Modified)) {
    notes.push(
      ...(await getModifiedNotesForDay(
        moment(message.currentDate, moment.ISO_8601),
        searchConstraints
      ))
    );
  }
  if (noteTypes.includes(NoteSearchTypes.Related)) {
    notes.push(
      ...(await getRelatedNotesForDay(
        moment(message.currentDate, moment.ISO_8601),
        searchConstraints
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

  const searchConstraints = await buildSearchConstraints();

  if (noteTypes.includes(NoteSearchTypes.Created)) {
    individualStatistics.push(
      await getMonthCreatedNoteStatistics(
        moment(message.date, moment.ISO_8601),
        searchConstraints
      )
    );
  }

  if (noteTypes.includes(NoteSearchTypes.Modified)) {
    individualStatistics.push(
      await getMonthModifiedNoteStatistics(
        moment(message.date, moment.ISO_8601),
        searchConstraints
      )
    );
  }

  if (noteTypes.includes(NoteSearchTypes.Related)) {
    individualStatistics.push(
      await getMonthRelatedNoteStatistics(
        moment(message.date, moment.ISO_8601),
        searchConstraints
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

  const searchConstraints = await buildSearchConstraints();

  const candidateDateReducer = (responses) =>
    responses.reduce((prev, curr) => {
      if (!curr) {
        return prev;
      }
      if (!prev) {
        return curr;
      }

      const currDate = moment(curr.date, moment.ISO_8601);
      const prevDate = moment(prev.date, moment.ISO_8601);

      if (message.direction === "future") {
        return currDate.isBefore(prevDate) ? curr : prev;
      } else {
        return currDate.isAfter(prevDate) ? curr : prev;
      }
    }, null);

  const candidateResponses: GetNearestDayWithNoteResponse[] = [];

  if (noteTypes.includes(NoteSearchTypes.Created)) {
    candidateResponses.push(
      await getNearestDayWithCreatedNote(
        moment(message.date, moment.ISO_8601),
        message.direction,
        searchConstraints
      )
    );
  }
  if (noteTypes.includes(NoteSearchTypes.Modified)) {
    candidateResponses.push(
      await getNearestDayWithModifiedNote(
        moment(message.date, moment.ISO_8601),
        message.direction,
        searchConstraints
      )
    );
  }

  if (noteTypes.includes(NoteSearchTypes.Related)) {
    const earlyStopDate = candidateDateReducer(candidateResponses);
    candidateResponses.push(
      await getNearestDayWithRelatedNote(
        moment(message.date, moment.ISO_8601),
        message.direction,
        earlyStopDate,
        searchConstraints
      )
    );
  }

  return candidateDateReducer(candidateResponses);
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
