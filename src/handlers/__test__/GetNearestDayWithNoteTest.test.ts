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
  it("uses correct query based if direction is future", async () => {
    mockedJoplin.data.get.mockResolvedValue({
      items: [
        {
          id: "testId",
          title: "testTitle",
          user_created_time: 0,
        },
      ],
    });

    const result = await handlePanelMessage({
      type: MsgType.GetNearestDayWithNote,
      date: moment(0).toISOString(),
      direction: "future",
    });

    expect(result).toStrictEqual({
      date: "1970-01-01T00:00:00.000Z",
      note: {
        id: "testId",
        title: "testTitle",
        createdTime: "1970-01-01T00:00:00.000Z",
      },
    });

    expect(mockedJoplin.data.get).toBeCalledWith(
      ["search"],
      expect.objectContaining({
        query: "created:19700101",
      })
    );
  });

  it("uses correct query based if direction is past", async () => {
    mockedJoplin.data.get.mockResolvedValue({
      items: [
        {
          id: "testId",
          title: "testTitle",
          user_created_time: 0,
        },
      ],
    });

    const result = await handlePanelMessage({
      type: MsgType.GetNearestDayWithNote,
      date: moment(0).toISOString(),
      direction: "past",
    });

    expect(result).toStrictEqual({
      date: "1970-01-01T00:00:00.000Z",
      note: {
        id: "testId",
        title: "testTitle",
        createdTime: "1970-01-01T00:00:00.000Z",
      },
    });

    expect(mockedJoplin.data.get).toBeCalledWith(
      ["search"],
      expect.objectContaining({
        query: "-created:19691231",
      })
    );
  });

  it("returns null if no notes found", async () => {
    mockedJoplin.data.get.mockResolvedValue({
      items: [],
    });

    const result = await handlePanelMessage({
      type: MsgType.GetNearestDayWithNote,
      date: moment(0).toISOString(),
      direction: "past",
    });

    expect(result).toBeNull();
  });
});
