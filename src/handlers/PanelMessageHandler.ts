import { camelCase, create } from "lodash";
import joplin from "api";
import MsgType from "@constants/messageTypes";
import moment from "moment";
import MonthStatistics from "@constants/MonthStatistics";

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

  return notes.map(convertSnakeCaseKeysToCamelCase);
}

async function getMonthStatistics(
  date: moment.Moment
): Promise<MonthStatistics> {
  const timeRemovedDate = date.startOf("day");
  const createdFromDate = timeRemovedDate.clone().startOf("month");
  const workingDate = createdFromDate.clone();
  const createdToDate = timeRemovedDate.clone().endOf("month");

  console.debug(`Fetching stats from ${createdFromDate} to ${createdToDate}`);

  const monthNotesPromises: Record<string, Promise<any>> = {};
  while (!workingDate.isAfter(createdToDate)) {
    monthNotesPromises[workingDate.format("L")] = getDayNotes(
      workingDate.clone()
    );
    workingDate.add(1, "day");
  }

  const monthNotes = {};
  for (const [key, promise] of Object.entries(monthNotesPromises)) {
    monthNotes[key] = await promise;
  }

  // Convert to statistics
  const notesPerDay = {};
  for (const [key, notes] of Object.entries(monthNotes)) {
    notesPerDay[key] = (notes as any[]).length;
  }

  const monthStats = {
    notesPerDay,
  };

  return monthStats;
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

    case MsgType.GetMonthStatistics:
      return await getMonthStatistics(moment(message.date, moment.ISO_8601));

    default:
      throw new Error(`Could not process message: ${message}`);
  }
}

export default handlePanelMessage;
