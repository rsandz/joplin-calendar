import moment from "moment";
import { getMonthStatistics } from "../GetMonthStatistics";
import joplin from "api";

jest.mock(
  "api",
  () => ({
    data: {
      get: jest.fn(),
    },
  }),
  { virtual: true }
);
const mockedJoplin = jest.mocked(joplin);

describe("Get Month Statistics", () => {
  it("can handle months with no notes", async () => {
    const mockNoteForDayRetriever = jest.fn();
    mockNoteForDayRetriever.mockResolvedValue([]);

    const result = await getMonthStatistics(
      moment("2023-05-29"),
      mockNoteForDayRetriever
    );

    const notesPerDayValues = Object.values(result.notesPerDay);
    expect(notesPerDayValues).toHaveLength(31);
    Object.values(notesPerDayValues).forEach((value) => {
      expect(value).toBe(0);
    });
  });

  it("can handle months with notes", async () => {
    const mockNoteForDayRetriever = jest.fn();
    mockNoteForDayRetriever.mockResolvedValue([
      {
        id: "testId",
        title: "testTitle",
        user_created_time: 0,
      },
    ]);

    const result = await getMonthStatistics(
      moment("2023-05-29"),
      mockNoteForDayRetriever
    );

    const notesPerDayValues = Object.values(result.notesPerDay);
    expect(notesPerDayValues).toHaveLength(31);
    Object.values(notesPerDayValues).forEach((value) => {
      expect(value).toBe(1);
    });
  });

  it("uses mm/dd/yyyy format for notes per day", async () => {
    const mockNoteForDayRetriever = jest.fn();
    mockNoteForDayRetriever.mockResolvedValue([]);

    const result = await getMonthStatistics(
      moment("2023-05-29"),
      mockNoteForDayRetriever
    );

    const notesPerDayKeys = Object.keys(result.notesPerDay);
    expect(notesPerDayKeys[0]).toEqual("05/01/2023");
    expect(notesPerDayKeys[1]).toEqual("05/02/2023");
    expect(notesPerDayKeys[2]).toEqual("05/03/2023");

    expect(notesPerDayKeys[30]).toEqual("05/31/2023");
  });
});
