import joplin from "api";
import MsgType from "@constants/messageTypes";
import moment from "moment";
import { getNearestDayWithCreatedNote } from "./GetNearestDayWithNote";
import { getMonthCreatedNoteStatistics } from "./GetMonthStatistics";
import { getCreatedNotesForDay } from "./GetNotesForDay";

async function openNote(id: string) {
  joplin.commands.execute("openNote", id);
}

/**
 * Handler for all messages coming from our panel webview.
 */
async function handlePanelMessage(message) {
  const msgType = message.type;
  console.debug(`Calendar: Got message: ${JSON.stringify(message)}`);
  switch (msgType) {
    case MsgType.GetNotes:
      if (!message.currentDate) {
        console.error(`Could not process message since missing date.`);
        return null;
      }
      return await getCreatedNotesForDay(
        moment(message.currentDate, moment.ISO_8601)
      );

    case MsgType.OpenNote:
      if (!message.id) {
        console.error(`Could not process message since missing id.`);
        return;
      }
      openNote(message.id);
      return;

    case MsgType.GetSelectedNote:
      return await joplin.workspace.selectedNote();

    case MsgType.GetMonthStatistics:
      return await getMonthCreatedNoteStatistics(
        moment(message.date, moment.ISO_8601)
      );

    case MsgType.GetNearestDayWithNote:
      return await getNearestDayWithCreatedNote(
        moment(message.date, moment.ISO_8601),
        message.direction
      );

    default:
      throw new Error(`Could not process message: ${message}`);
  }
}

export default handlePanelMessage;
