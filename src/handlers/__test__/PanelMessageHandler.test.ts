import MsgType from "@constants/messageTypes";
import {
  getCreatedNotesForDay,
  getModifiedNotesForDay,
} from "../GetNotesForDay";
import moment from "moment";
import handlePanelMessage from "../PanelMessageHandler";
import joplin from "api";
import Note from "@constants/Note";
import NoteSearchTypes from "@constants/NoteSearchTypes";
import {
  getMonthCreatedNoteStatistics,
  getMonthModifiedNoteStatistics,
} from "../GetMonthStatistics";
import MonthStatistics from "@constants/MonthStatistics";
import { result } from "lodash";
import {
  getNearestDayWithCreatedNote,
  getNearestDayWithModifiedNote,
} from "../GetNearestDayWithNote";
import { triggerAllSettingsCallbacks } from "../../settings";

jest.mock(
  "api",
  () => ({
    commands: {
      execute: jest.fn(),
    },
  }),
  { virtual: true }
);
const mockedJoplin = jest.mocked(joplin);

jest.mock("../GetNotesForDay");
const mockedGetCreatedNotesForDay = jest.mocked(getCreatedNotesForDay);
const mockedGetModifiedNotesForDay = jest.mocked(getModifiedNotesForDay);

jest.mock("../GetMonthStatistics");
const mockedGetMonthCreatedNoteStatistics = jest.mocked(
  getMonthCreatedNoteStatistics
);
const mockedGetMonthModifiedNoteStatistics = jest.mocked(
  getMonthModifiedNoteStatistics
);

jest.mock("../GetNearestDayWithNote");
const mockedGetNearestDayWithCreatedNote = jest.mocked(
  getNearestDayWithCreatedNote
);
const mockedGetNearestDayWithModifiedNote = jest.mocked(
  getNearestDayWithModifiedNote
);

jest.mock("../../settings");
const mockedTriggerAllSettingsCallbacks = jest.mocked(
  triggerAllSettingsCallbacks
);

describe("PanelMessageHandler", () => {
  const mockNote1: Note = {
    id: "TestId",
    title: "TestTitle",
    createdTime: "1970-01-01T00:00:00.000Z",
    updatedTime: "1970-01-01T00:00:00.000Z",
  };
  const currentDate = moment().toISOString();

  it("handles get notes with no note search type", async () => {
    const msg = {
      type: MsgType.GetNotes,
      currentDate: currentDate,
    };

    mockedGetCreatedNotesForDay.mockResolvedValue([mockNote1]);

    await handlePanelMessage(msg);

    expect(getCreatedNotesForDay).toHaveBeenCalled();
  });

  it("handles get notes with multiple note search type", async () => {
    const msg = {
      type: MsgType.GetNotes,
      currentDate: currentDate,
      noteSearchTypes: [NoteSearchTypes.Created, NoteSearchTypes.Modified],
    };

    mockedGetCreatedNotesForDay.mockResolvedValue([mockNote1]);
    mockedGetModifiedNotesForDay.mockResolvedValue([mockNote1]);

    await handlePanelMessage(msg);

    expect(getCreatedNotesForDay).toHaveBeenCalled();
    expect(getModifiedNotesForDay).toHaveBeenCalled();
  });

  it("handles get month statistics with no note search type", async () => {
    const msg = {
      type: MsgType.GetMonthStatistics,
      date: currentDate,
    };

    mockedGetMonthCreatedNoteStatistics.mockResolvedValue({
      notesPerDay: {
        "01-01-1999": 1,
      },
    });

    const result: MonthStatistics = await handlePanelMessage(msg);

    expect(result).toStrictEqual({
      notesPerDay: {
        "01-01-1999": 1,
      },
    });
  });

  it("handles get month statistics with multiple note search type", async () => {
    const msg = {
      type: MsgType.GetMonthStatistics,
      date: currentDate,
      noteSearchTypes: [NoteSearchTypes.Created, NoteSearchTypes.Modified],
    };

    mockedGetMonthCreatedNoteStatistics.mockResolvedValue({
      notesPerDay: {
        "01-01-1999": 1,
      },
    });

    mockedGetMonthModifiedNoteStatistics.mockResolvedValue({
      notesPerDay: {
        "01-01-1999": 1,
      },
    });

    const result = await handlePanelMessage(msg);

    expect(result).toStrictEqual({
      notesPerDay: {
        "01-01-1999": 2,
      },
    });
  });

  it("handles get nearest day with no note search type", async () => {
    const msg = {
      type: MsgType.GetNearestDayWithNote,
      date: currentDate,
      direction: "future",
    };

    mockedGetNearestDayWithCreatedNote.mockResolvedValue({
      date: currentDate,
      note: mockNote1,
    });

    const result = await handlePanelMessage(msg);

    expect(result).toStrictEqual({
      date: currentDate,
      note: mockNote1,
    });
  });

  it("handles get nearest day with multiple note search type", async () => {
    const msg = {
      type: MsgType.GetNearestDayWithNote,
      date: currentDate,
      direction: "future",
      noteSearchTypes: [NoteSearchTypes.Created, NoteSearchTypes.Modified],
    };

    mockedGetNearestDayWithCreatedNote.mockResolvedValue({
      date: currentDate,
      note: mockNote1,
    });

    mockedGetNearestDayWithModifiedNote.mockResolvedValue({
      date: moment().add(10, "days").toISOString(),
      note: mockNote1,
    });

    const result = await handlePanelMessage(msg);

    expect(result).toStrictEqual({
      date: currentDate,
      note: mockNote1,
    });
  });

  it("handles get nearest day with note but none exist", async () => {
    const msg = {
      type: MsgType.GetNearestDayWithNote,
      date: currentDate,
      direction: "future",
      noteSearchTypes: [NoteSearchTypes.Created, NoteSearchTypes.Modified],
    };

    mockedGetNearestDayWithCreatedNote.mockResolvedValue(null);
    mockedGetNearestDayWithModifiedNote.mockResolvedValue(null);

    const result = await handlePanelMessage(msg);

    expect(result).toStrictEqual(null);
  });

  it("handles get nearest day with note but only modified note exist", async () => {
    const msg = {
      type: MsgType.GetNearestDayWithNote,
      date: currentDate,
      direction: "future",
      noteSearchTypes: [NoteSearchTypes.Created, NoteSearchTypes.Modified],
    };

    mockedGetNearestDayWithCreatedNote.mockResolvedValue(null);
    mockedGetNearestDayWithModifiedNote.mockResolvedValue({
      date: currentDate,
      note: mockNote1,
    });

    const result = await handlePanelMessage(msg);

    expect(result).toStrictEqual({
      date: currentDate,
      note: mockNote1,
    });
  });

  it("handles trigger all settings callback", () => {
    const msg = {
      type: MsgType.TriggerAllSettingsCallbacks,
    };

    handlePanelMessage(msg);

    expect(mockedTriggerAllSettingsCallbacks).toHaveBeenCalled();
  });
});
