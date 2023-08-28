import joplin from "api";
import handlePanelMessage from "../PanelMessageHandler";
import MsgType from "@constants/messageTypes";
import moment from "moment";

jest.mock(
  "api",
  () => ({
    data: {
      get: jest.fn(async () => ({
        items: [],
      })),
    },
  }),
  { virtual: true }
);
const mockedJoplin = jest.mocked(joplin);

describe("GetDayNotes", () => {
  it("calls joplin api with the correct query", async () => {
    const result = await handlePanelMessage({
      type: MsgType.GetNotes,
      currentDate: moment("2023-05-29").toISOString(),
    });

    expect(mockedJoplin.data.get).toHaveBeenCalledWith(["search"], {
      fields: expect.any(Array),
      query: "created:20230529 -created:20230530",
      page: expect.any(Number),
    });
  });

  it("returns single note correctly", async () => {
    mockedJoplin.data.get.mockImplementationOnce(async () => ({
      items: [
        {
          id: "testId",
          title: "testTitle",
          user_created_time: 0,
        },
      ],
    }));

    const result = await handlePanelMessage({
      type: MsgType.GetNotes,
      currentDate: moment("2023-05-29").toISOString(),
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "testId",
      title: "testTitle",
      createdTime: "1970-01-01T00:00:00.000Z",
    });
  });

  it("returns multiple notes correctly", async () => {
    mockedJoplin.data.get
      .mockImplementationOnce(async () => ({
        items: [
          {
            id: "testId",
            title: "testTitle",
            user_created_time: 0,
          },
        ],
        has_more: true,
      }))
      .mockImplementationOnce(async () => ({
        items: [
          {
            id: "testId2",
            title: "testTitle2",
            user_created_time: 3600000,
          },
        ],
        has_more: true,
      }));

    const result = await handlePanelMessage({
      type: MsgType.GetNotes,
      currentDate: moment("2023-05-29").toISOString(),
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "testId",
      title: "testTitle",
      createdTime: "1970-01-01T00:00:00.000Z",
    });
    expect(result[1]).toEqual({
      id: "testId2",
      title: "testTitle2",
      createdTime: "1970-01-01T01:00:00.000Z",
    });
  });

  it("returns nothing if current date is not provided", async () => {
    const result = await handlePanelMessage({
      type: MsgType.GetNotes,
    });

    expect(result).toBeNull();
  });
});
