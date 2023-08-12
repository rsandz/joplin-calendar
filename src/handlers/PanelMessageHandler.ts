import { camelCase } from "lodash";
import joplin from "api";
import MsgType from "@constants/messageTypes";
import moment from "moment";

function convertSnakeCaseKeysToCamelCase(object: any) {
  return Object.entries(object).reduce((newObj, [key, value]) => {
    newObj[camelCase(key)] = value;
    return newObj;
  }, {});
}

async function openNote(id: string) {
  joplin.commands.execute("openNote", id);
}

/**
 * Gets all the notes for a specified day.
 */
async function getDayNotes(date: moment.Moment) {
  const notes = [];

  const createdFromDate = date.format("YYYYMMDD");
  const createdToDate = date.add(1, "day").format("YYYYMMDD");

  console.debug(`Fetching notes from ${createdFromDate} to ${createdToDate}`);

  let page = 1;
  let paginatedResponse: Record<string, any>;
  do {
    paginatedResponse = await joplin.data.get(["search"], {
      fields: ["id", "title", "created_time"],
      query: `created:${createdFromDate} -created:${createdToDate}`,
      page: page,
    });
    notes.push(...paginatedResponse.items);
  } while (paginatedResponse.has_more);

  console.debug(`Parsed ${page} pages of notes.`);
  return notes.map(convertSnakeCaseKeysToCamelCase);
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
      return await getDayNotes(moment(message.currentDate, moment.ISO_8601));

    case MsgType.OpenNote:
      if (!message.id) {
        console.error(`Could not process message since missing id.`);
        return;
      }
      openNote(message.id);
      return;

    case MsgType.GetSelectedNote:
      return await joplin.workspace.selectedNote();

    default:
      throw new Error(`Could not process message: ${message}`);
  }
}

export default handlePanelMessage;
