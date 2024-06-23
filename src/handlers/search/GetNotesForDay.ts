import joplin from "api";
import {
  removeUserTermFromUserTimes,
  convertSnakeCaseKeysToCamelCase,
  convertEpochDateInNoteToIsoString,
} from "../Transforms";
import { getDateFormat } from "../GlobalSettings";
import { buildSearchQuery } from "./SearchQuery";
import { SearchConstraints } from "./SearchConstraints";

/**
 * Get notes for a specific day using the provided operator term.
 *
 * @param date The date to get notes for
 * @param operatorTerm https://discourse.joplinapp.org/t/search-syntax-documentation/9110
 * @param searchConstraints Adttional constraints to apply when searching for notes.
 * @return The notes for a given day that matches operator term criteria.
 */
export async function getNotesForDay(
  date: moment.Moment,
  operatorTerm: string,
  searchConstraints?: SearchConstraints
) {
  const notes = [];

  const fromDate = date.format("YYYYMMDD");
  const toDate = date.add(1, "day").format("YYYYMMDD");

  let page = 1;
  let paginatedResponse: Record<string, any>;
  do {
    const searchQuery = buildSearchQuery({
      query: `${operatorTerm}:${fromDate} -${operatorTerm}:${toDate}`,
      page: page,
      searchConstraints: searchConstraints,
    });
    paginatedResponse = await joplin.data.get(["search"], searchQuery);
    notes.push(...paginatedResponse.items);
    page++;
  } while (paginatedResponse.has_more);

  return notes
    .map(removeUserTermFromUserTimes)
    .map(convertSnakeCaseKeysToCamelCase)
    .map(convertEpochDateInNoteToIsoString);
}

export async function getCreatedNotesForDay(
  date: moment.Moment,
  searchConstraints?: SearchConstraints
) {
  return getNotesForDay(date, "created", searchConstraints);
}

export async function getModifiedNotesForDay(
  date: moment.Moment,
  searchConstraints?: SearchConstraints
) {
  return getNotesForDay(date, "updated", searchConstraints);
}

/**
 * Gets list of related notes for a specific day.
 * Related notes are notes that have the day in the title.
 */
export async function getRelatedNotesForDay(
  date: moment.Moment,
  searchConstraints?: SearchConstraints
) {
  const notes = [];

  const dateString = date.format(await getDateFormat());

  let page = 1;
  let paginatedResponse: Record<string, any>;
  do {
    const searchQuery = buildSearchQuery({
      query: `title:/"${dateString}"`,
      page: page,
      searchConstraints: searchConstraints,
    });
    paginatedResponse = await joplin.data.get(["search"], searchQuery);
    notes.push(...paginatedResponse.items);
    page++;
  } while (paginatedResponse.has_more);

  return notes
    .map(removeUserTermFromUserTimes)
    .map(convertSnakeCaseKeysToCamelCase)
    .map(convertEpochDateInNoteToIsoString);
}
