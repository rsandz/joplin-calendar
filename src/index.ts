import joplin from "api";
import moment from "moment";

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

joplin.plugins.register({
  onStart: async function () {
    const panel = await joplin.views.panels.create("calendar_panel");
    await joplin.views.panels.addScript(panel, "gui/index.js");
  },
});
