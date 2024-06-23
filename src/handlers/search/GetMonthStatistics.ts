import moment from "moment";
import MonthStatistics from "@constants/MonthStatistics";
import {
  getCreatedNotesForDay,
  getModifiedNotesForDay,
  getRelatedNotesForDay,
} from "./GetNotesForDay";
import Note from "@constants/Note";
import { SearchConstraints } from "./SearchConstraints";

type NoteForDayRetriever = (
  date: moment.Moment,
  searchConstraints?: SearchConstraints
) => Promise<Note[]>;

/**
 * Get stastistics for each day in a month.
 *
 * @param date Date for which month statistics will be fetched for.
 * @param noteForDayRetriever The function to retrieve notes for a given day.
 * @return Map containing statistics for each day.
 */
export async function getMonthStatistics(
  date: moment.Moment,
  noteForDayRetriever: NoteForDayRetriever,
  searchConstraints?: SearchConstraints
): Promise<MonthStatistics> {
  const dateWithNoTime = date.startOf("day");
  const fromDate = dateWithNoTime.clone().startOf("month");
  const workingDate = fromDate.clone();
  const toDate = dateWithNoTime.clone().endOf("month");

  console.debug(`Fetching stats from ${fromDate} to ${toDate}`);

  const monthNotesPromises: Record<string, Promise<any>> = {};
  while (!workingDate.isAfter(toDate)) {
    monthNotesPromises[workingDate.format("L")] = noteForDayRetriever(
      workingDate.clone(),
      searchConstraints
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

export async function getMonthCreatedNoteStatistics(
  date: moment.Moment,
  searchConstraints?: SearchConstraints
): Promise<MonthStatistics> {
  return getMonthStatistics(date, getCreatedNotesForDay, searchConstraints);
}

export async function getMonthModifiedNoteStatistics(
  date: moment.Moment,
  searchConstraints?: SearchConstraints
): Promise<MonthStatistics> {
  return getMonthStatistics(date, getModifiedNotesForDay, searchConstraints);
}

export async function getMonthRelatedNoteStatistics(
  date: moment.Moment,
  searchConstraints?: SearchConstraints
): Promise<MonthStatistics> {
  return getMonthStatistics(date, getRelatedNotesForDay, searchConstraints);
}
