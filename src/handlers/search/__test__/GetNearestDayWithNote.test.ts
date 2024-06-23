import handlePanelMessage from "../../PanelMessageHandler";
import MsgType from "@constants/messageTypes";
import joplin from "api";
import moment from "moment";
import {
  getNearestDayWithModifiedNote,
  getNearestDayWithRelatedNote,
} from "../GetNearestDayWithNote";
import { getDateFormat } from "../../GlobalSettings";
import _ from "lodash";
import { settings } from "cluster";

jest.mock(
  "api",
  () => ({
    data: {
      get: jest.fn(),
    },
    settings: {
      value: jest.fn(),
    },
  }),
  { virtual: true }
);
const mockedJoplin = jest.mocked(joplin);

jest.mock("../../GlobalSettings");
const mockedGetDateFormat = jest.mocked(getDateFormat);

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

describe("Get Nearest Related Note", () => {
  beforeEach(() => {
    mockedGetDateFormat.mockResolvedValue("YYYY/MM/DD");
  });

  const apiReturnNote = Object.freeze({
    id: "testId",
    title: "testTitle",
    user_created_time: moment.utc("2024-02-17", "YYYY-MM-DD").valueOf(),
    user_updated_time: moment.utc("2024-02-17", "YYYY-MM-DD").valueOf(),
  });

  const transformedNote = Object.freeze({
    id: "testId",
    title: "testTitle",
    createdTime: "2024-02-17T00:00:00.000Z",
    updatedTime: "2024-02-17T00:00:00.000Z",
  });

  it("returns a related note in future if found", async () => {
    mockedJoplin.data.get.mockImplementation((path, query) => {
      if (query.query === 'title:/"2024/02/17"') {
        return Promise.resolve({
          items: [_.clone(apiReturnNote)],
        });
      } else {
        return Promise.resolve({
          items: [],
        });
      }
    });

    const result = await getNearestDayWithRelatedNote(
      moment.utc("2024-02-14", "YYYY-MM-DD"),
      "future",
      null
    );

    expect(result).toStrictEqual({
      date: moment.utc("2024-02-17", "YYYY-MM-DD").toISOString(),
      note: transformedNote,
    });
  });

  it("returns a related note in past if found", async () => {
    mockedJoplin.data.get.mockImplementation((path, query) => {
      if (query.query === 'title:/"2024/02/17"') {
        return Promise.resolve({
          items: [_.cloneDeep(apiReturnNote)],
        });
      } else {
        return Promise.resolve({
          items: [],
        });
      }
    });

    const result = await getNearestDayWithRelatedNote(
      moment.utc("2024-02-24", "YYYY-MM-DD"),
      "past",
      null
    );

    expect(result).toStrictEqual({
      date: moment.utc("2024-02-17", "YYYY-MM-DD").toISOString(),
      note: transformedNote,
    });
  });

  it("stops early if given a stopEarly date", async () => {
    mockedJoplin.data.get.mockImplementation((path, query) => {
      if (query.query === 'title:"2024/02/17"') {
        return Promise.resolve({
          items: [apiReturnNote],
        });
      } else {
        return Promise.resolve({
          items: [],
        });
      }
    });

    const result = await getNearestDayWithRelatedNote(
      moment.utc("2024-02-14", "YYYY-MM-DD"),
      "future",
      moment.utc("2024-02-15", "YYYY-MM-DD")
    );

    expect(result).toStrictEqual(null);
  });

  it("returns null if no notes found", async () => {
    mockedJoplin.data.get.mockResolvedValue({
      items: [],
    });
    const result = await getNearestDayWithRelatedNote(
      moment("1970-01-01", "YYYY-MM-DD"),
      "past",
      null
    );
  });
});
