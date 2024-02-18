import joplin from "api";
import moment from "moment";
import {
  getCreatedNotesForDay,
  getRelatedNotesForDay,
} from "../GetNotesForDay";
import { getDateFormat } from "../GlobalSettings";

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

jest.mock("../GlobalSettings");
const mockedGetDateFormat = jest.mocked(getDateFormat);

describe("Get Notes For Day", () => {
  it("calls joplin api with the correct query", async () => {
    getCreatedNotesForDay(moment("2023-05-29"));

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
          user_updated_time: 0,
        },
      ],
    }));

    const result = await getCreatedNotesForDay(moment("2023-05-29"));

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "testId",
      title: "testTitle",
      createdTime: "1970-01-01T00:00:00.000Z",
      updatedTime: "1970-01-01T00:00:00.000Z",
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
            user_updated_time: 0,
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
            user_updated_time: 0,
          },
        ],
        has_more: true,
      }));

    const result = await getCreatedNotesForDay(moment("2023-05-29"));

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "testId",
      title: "testTitle",
      createdTime: "1970-01-01T00:00:00.000Z",
      updatedTime: "1970-01-01T00:00:00.000Z",
    });
    expect(result[1]).toEqual({
      id: "testId2",
      title: "testTitle2",
      createdTime: "1970-01-01T01:00:00.000Z",
      updatedTime: "1970-01-01T00:00:00.000Z",
    });
  });
});

describe("Get Related Notes for day", () => {
  mockedGetDateFormat.mockResolvedValue("YYYY/MM/DD");

  it("calls joplin api with the correct query", async () => {
    await getRelatedNotesForDay(moment("2023-05-29"));

    expect(mockedJoplin.data.get).toHaveBeenCalledWith(["search"], {
      fields: expect.any(Array),
      query: 'title:/"2023/05/29"',
      page: expect.any(Number),
    });
  });

  it("returns single note correctly", async () => {
    mockedJoplin.data.get.mockImplementationOnce(async () => ({
      items: [
        {
          id: "testId",
          title: "2023/05/29",
          user_created_time: 0,
          user_updated_time: 0,
        },
      ],
    }));

    const result = await getRelatedNotesForDay(moment("2023-05-29"));

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: "testId",
      title: "2023/05/29",
      createdTime: "1970-01-01T00:00:00.000Z",
      updatedTime: "1970-01-01T00:00:00.000Z",
    });
  });
});
