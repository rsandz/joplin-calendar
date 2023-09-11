import NoteSearchTypes from "@constants/NoteSearchTypes";
import handlePanelMessage from "../PanelMessageHandler";
import MsgType from "@constants/messageTypes";
import joplin from "api";
import moment from "moment";
import { getNearestDayWithModifiedNote } from "../GetNearestDayWithNote";

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

describe("GetNearestDayWithNote", () => {
  const baselineDate = moment("1970-01-01", "YYYY-MM-DD");

  it("uses correct query based if direction is future", async () => {
    const baselinePlusOneDate = baselineDate.clone().add(1, "day");
    mockedJoplin.data.get.mockResolvedValue({
      items: [
        {
          id: "testId",
          title: "testTitle",
          user_created_time: baselinePlusOneDate.valueOf(),
          user_updated_time: "1970-01-01T00:00:00.000Z",
        },
      ],
    });

    const result = await handlePanelMessage({
      type: MsgType.GetNearestDayWithNote,
      date: baselineDate.toISOString(),
      direction: "future",
    });

    expect(result).toStrictEqual({
      date: baselinePlusOneDate.toISOString(),
      note: {
        id: "testId",
        title: "testTitle",
        createdTime: baselinePlusOneDate.toISOString(),
        updatedTime: "1970-01-01T00:00:00.000Z",
      },
    });

    expect(mockedJoplin.data.get).toBeCalledWith(
      ["search"],
      expect.objectContaining({
        query: `created:${baselinePlusOneDate.format("YYYYMMDD")}`,
      })
    );
  });

  it("uses correct query based if direction is past", async () => {
    const baselineMinusOneDate = baselineDate.clone().subtract(1, "day");
    mockedJoplin.data.get.mockResolvedValue({
      items: [
        {
          id: "testId",
          title: "testTitle",
          user_created_time: baselineMinusOneDate.valueOf(),
          user_updated_time: "1970-01-01T00:00:00.000Z",
        },
      ],
    });

    const result = await handlePanelMessage({
      type: MsgType.GetNearestDayWithNote,
      date: baselineDate.toISOString(),
      direction: "past",
    });

    expect(result).toStrictEqual({
      date: baselineMinusOneDate.toISOString(),
      note: {
        id: "testId",
        title: "testTitle",
        createdTime: baselineMinusOneDate.toISOString(),
        updatedTime: "1970-01-01T00:00:00.000Z",
      },
    });

    expect(mockedJoplin.data.get).toBeCalledWith(
      ["search"],
      expect.objectContaining({
        query: `-created:${baselineDate.format("YYYYMMDD")}`,
      })
    );
  });

  it("returns correct date depending on search operator term", async () => {
    const baselineMinusOneDate = baselineDate.clone().subtract(1, "day");
    const baselineMinusEightDate = baselineDate.clone().subtract(8, "day");
    mockedJoplin.data.get.mockResolvedValue({
      items: [
        {
          id: "testId",
          title: "testTitle",
          user_created_time: baselineMinusEightDate.valueOf(),
          user_updated_time: baselineMinusOneDate.valueOf(),
        },
      ],
    });

    const result = await getNearestDayWithModifiedNote(
      baselineDate.clone(),
      "past"
    );

    expect(result).toStrictEqual({
      date: baselineMinusOneDate.toISOString(),
      note: {
        id: "testId",
        title: "testTitle",
        createdTime: baselineMinusEightDate.toISOString(),
        updatedTime: baselineMinusOneDate.toISOString(),
      },
    });
  });

  it("returns null if no notes found", async () => {
    mockedJoplin.data.get.mockResolvedValue({
      items: [],
    });

    const result = await handlePanelMessage({
      type: MsgType.GetNearestDayWithNote,
      date: baselineDate.toISOString(),
      direction: "past",
    });

    expect(result).toBeNull();
  });
});
