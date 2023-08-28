import handlePanelMessage from "../PanelMessageHandler";
import MsgType from "@constants/messageTypes";
import joplin from "api";
import moment from "moment";

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
      },
    });

    expect(mockedJoplin.data.get).toBeCalledWith(
      ["search"],
      expect.objectContaining({
        query: `-created:${baselineDate.format("YYYYMMDD")}`,
      })
    );
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
