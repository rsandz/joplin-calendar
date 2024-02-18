import joplin from "api";
import {
  removeUserTermFromUserTimes,
  convertSnakeCaseKeysToCamelCase,
  convertEpochDateInNoteToIsoString,
} from "./Transforms";
import { getDateFormat } from "./GlobalSettings";

/**
 * Get notes for a specific day using the provided operator term.
 *
 * @param date The date to get notes for
 * @param operatorTerm https://discourse.joplinapp.org/t/search-syntax-documentation/9110
 * @return The notes for a given day that matches operator term criteria.
 */
async function getNotesForDay(date: moment.Moment, operatorTerm: string) {
  const notes = [];

  const fromDate = date.format("YYYYMMDD");
  const toDate = date.add(1, "day").format("YYYYMMDD");

  let page = 1;
  let paginatedResponse: Record<string, any>;
  do {
    paginatedResponse = await joplin.data.get(["search"], {
      fields: ["id", "title", "user_created_time", "user_updated_time"],
      query: `${operatorTerm}:${fromDate} -${operatorTerm}:${toDate}`,
      page: page,
    });
    notes.push(...paginatedResponse.items);
    page++;
  } while (paginatedResponse.has_more);

  return notes
    .map(removeUserTermFromUserTimes)
    .map(convertSnakeCaseKeysToCamelCase)
    .map(convertEpochDateInNoteToIsoString);
}

export async function getCreatedNotesForDay(date: moment.Moment) {
  return getNotesForDay(date, "created");
}

export async function getModifiedNotesForDay(date: moment.Moment) {
  return getNotesForDay(date, "updated");
}

/**
 * Gets list of related notes for a specific day.
 * Related notes are notes that have the day in the title.
 */
export async function getRelatedNotesForDay(date: moment.Moment) {
  const notes = [];

  const dateString = date.format(await getDateFormat());

  let page = 1;
  let paginatedResponse: Record<string, any>;
  do {
    paginatedResponse = await joplin.data.get(["search"], {
      fields: ["id", "title", "user_created_time", "user_updated_time"],
      query: `title:/"${dateString}"`,
      page: page,
    });
    notes.push(...paginatedResponse.items);
    page++;
  } while (paginatedResponse.has_more);

  return notes
    .map(removeUserTermFromUserTimes)
    .map(convertSnakeCaseKeysToCamelCase)
    .map(convertEpochDateInNoteToIsoString);
}
