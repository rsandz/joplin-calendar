import joplin from "api";
import moment from "moment";
import MsgType from "@constants/messageTypes";

async function getMonthNotes(date: moment.Moment) {
  const notes = [];

  const createdFromDate = date.format("YYYYMM");
  const createdToDate = date.add(1, "month").format("YYYYMM");

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
  return notes;
}

async function handlePanelMessage(message) {
  const msgType = message.type;
  console.debug(`Calendar: Got message: ${JSON.stringify(message)}`);
  switch (msgType) {
    case MsgType.GetNotes:
      if (!message.currentDate) {
        console.error(`Could not process ${message} since missing date.`);
        return null;
      }
      return await getMonthNotes(moment(message.currentDate, moment.ISO_8601));

    default:
      throw new Error(`Could not process message: ${message}`);
  }
}

joplin.plugins.register({
  onStart: async function () {
    const panel = await joplin.views.panels.create("calendar_panel");
    await joplin.views.panels.onMessage(panel, handlePanelMessage);
    await joplin.views.panels.addScript(panel, "gui/index.js");
  },
});
