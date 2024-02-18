import joplin from "api";
import moment from "moment";
import { GetNearestDayWithNoteResponse } from "@constants/GetNearestDayWithNote";
import {
  removeUserTermFromUserTimes,
  convertSnakeCaseKeysToCamelCase,
  convertEpochDateInNoteToIsoString,
} from "./Transforms";
import { getDateFormat } from "./GlobalSettings";

/**
 * Get notes in past or future matching the specific operator term.
 *
 * @param startDate The date where search will begin from
 * @param direction "future" or "past"
 * @param operatorTerm https://discourse.joplinapp.org/t/search-syntax-documentation/9110
 * @param orderByTerm https://discourse.joplinapp.org/t/search-syntax-documentation/9110
 * @return The nearest day from start date which has note matching specified criteria or null if none exist.
 */
async function getNearestDayWithNote(
  startDate: moment.Moment,
  direction: "future" | "past",
  operatorTerm: string,
  orderByTerm: string
): Promise<GetNearestDayWithNoteResponse | null> {
  const date = startDate.clone();
  let queryString = "";
  if (direction === "past") {
    queryString = `-${operatorTerm}:${date.format("YYYYMMDD")}`;
  } else {
    queryString = `${operatorTerm}:${date.add(1, "day").format("YYYYMMDD")}`;
  }

  const response = await joplin.data.get(["search"], {
    fields: ["id", "title", "user_created_time", "user_updated_time"],
    limit: 1,
    order_by: orderByTerm,
    order_dir: direction === "past" ? "DESC" : "ASC",
    query: queryString,
  });

  if (response.items.length === 0) {
    return null;
  }

  let note = response.items[0];
  const dateOfInterest = moment(note[orderByTerm]).toISOString();
  note = removeUserTermFromUserTimes(note);
  note = convertSnakeCaseKeysToCamelCase(note);
  const transformedNote = convertEpochDateInNoteToIsoString(note);

  return {
    date: dateOfInterest,
    note: transformedNote,
  };
}

export async function getNearestDayWithCreatedNote(
  startDate: moment.Moment,
  direction: "future" | "past"
): Promise<GetNearestDayWithNoteResponse | null> {
  return getNearestDayWithNote(
    startDate,
    direction,
    "created",
    "user_created_time"
  );
}

export async function getNearestDayWithModifiedNote(
  startDate: moment.Moment,
  direction: "future" | "past"
): Promise<GetNearestDayWithNoteResponse | null> {
  return getNearestDayWithNote(
    startDate,
    direction,
    "updated",
    "user_updated_time"
  );
}

const RELATED_NOTE_MAX_DAYS_TO_SEARCH = 120; // ~4 months

/**
 * Gets nearest day with related notes.
 * Related notes are notes that have the day in the title.
 *
 * @param startDate The date where search will begin from
 * @param direction "future" or "past"
 *
 * @param earlyStopDate If previous notes from other criteria are found, provide
 * the date to stop searching at. Increases responsiveness of search.
 */
export async function getNearestDayWithRelatedNote(
  startDate: moment.Moment,
  direction: "future" | "past",
  earlyStopDate: moment.Moment | null
): Promise<GetNearestDayWithNoteResponse | null> {
  const dateFormat = await getDateFormat();

  const workingDate = startDate.clone();
  for (let i = 0; i < RELATED_NOTE_MAX_DAYS_TO_SEARCH; i++) {
    // Don't include the startDate
    if (direction === "past") {
      workingDate.subtract(1, "day");
    } else {
      workingDate.add(1, "day");
    }

    if (earlyStopDate && workingDate.isSame(earlyStopDate, "day")) {
      return null;
    }

    const dateString = workingDate.format(dateFormat);

    const response = await joplin.data.get(["search"], {
      fields: ["id", "title", "user_created_time", "user_updated_time"],
      limit: 1,
      query: `title:/"${dateString}"`,
    });

    if (response.items.length > 0) {
      let note = response.items[0];
      note = removeUserTermFromUserTimes(note);
      note = convertSnakeCaseKeysToCamelCase(note);
      const transformedNote = convertEpochDateInNoteToIsoString(note);
      return {
        note: transformedNote,
        date: workingDate.toISOString(),
      };
    }
  }

  return null;
}
