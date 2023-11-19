import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NoteList from "..";
import moment from "moment";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom/extend-expect";
import MsgType from "@constants/messageTypes";
import useNoteSearchTypes from "../../hooks/useNoteSearchTypes";
import NoteSearchTypes from "@constants/NoteSearchTypes";

const DOCUMENT_FOLLOWING = 4;

const postMessageMock = jest.fn();
const onMessageMock = jest.fn();

// Mock Webview Api in global scope
global.webviewApi = {
  postMessage: postMessageMock,
  onMessage: onMessageMock,
};

jest.mock("../../hooks/useNoteSearchTypes");
const mockedUseNoteSearchTypes = jest.mocked(useNoteSearchTypes);

const queryClient = new QueryClient();
function wrapper(children: React.JSX.Element) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("NoteList", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseNoteSearchTypes.mockReturnValue([NoteSearchTypes.Created]);

    postMessageMock.mockImplementation((payload) => {
      if (payload.type === MsgType.GetNotes) {
        return Promise.resolve([
          {
            id: "testId",
            title: "Test Title",
            createdTime: "1",
          },
          {
            id: "testId2",
            title: "Test Title 2",
            createdTime: "2",
          },
        ]);
      } else if (payload.type === MsgType.OpenNote) {
        return Promise.resolve();
      } else if (payload.type === MsgType.GetSelectedNote)
        return Promise.resolve({
          id: "testId",
          title: "Test Title",
          createdTime: "1",
        });
    });
  });

  it("shows note correctly", async () => {
    render(wrapper(<NoteList currentDate={moment()} />));
    await waitFor(() => expect(screen.getByText("Test Title")).toBeDefined());
  });

  it("shows no notes found if no notes returned", async () => {
    postMessageMock.mockReturnValue([]);
    render(wrapper(<NoteList currentDate={moment()} />));
    await waitFor(() =>
      expect(screen.getByText("No Notes Found")).toBeDefined()
    );
  });

  it("handles note change correctly", async () => {
    render(wrapper(<NoteList currentDate={moment()} />));

    expect(onMessageMock).toBeCalled();
    const onMessageCb = onMessageMock.mock.lastCall[0];

    postMessageMock.mockImplementation((payload) => {
      if (payload.type === MsgType.GetNotes) {
        return Promise.resolve([
          {
            id: "testId",
            title: "Test Title",
            createdTime: "1",
          },
          {
            id: "testId2",
            title: "Test Title 2",
            createdTime: "2",
          },
        ]);
      } else if (payload.type === MsgType.OpenNote) {
        return Promise.resolve();
      } else if (payload.type === MsgType.GetSelectedNote)
        return Promise.resolve({
          id: "testId2",
        });
    });

    act(() => {
      onMessageCb({
        message: {
          type: MsgType.NoteChanged,
        },
      });
    });
    await waitFor(() => expect(screen.getByText("Test Title")).toBeDefined());

    expect(screen.getByText("Test Title 2").parentElement).toHaveStyle(
      "background-color: var(--joplin-background-color-hover3);"
    );
  });

  it("calls callback when next day button is clicked", () => {
    const nextDayCb = jest.fn();
    render(
      wrapper(<NoteList currentDate={moment()} onNextDayClick={nextDayCb} />)
    );

    act(() => {
      screen.getByRole("button", { name: "note-list-next" }).click();
    });

    expect(nextDayCb).toBeCalled();
  });

  it("calls callback when previous day button is clicked", () => {
    const prevDayCb = jest.fn();
    render(
      wrapper(
        <NoteList currentDate={moment()} onPreviousDayClick={prevDayCb} />
      )
    );

    act(() => {
      screen.getByRole("button", { name: "note-list-previous" }).click();
    });

    expect(prevDayCb).toBeCalled();
  });

  it("calls callback when previous day button is clicked", () => {
    const todayCb = jest.fn();
    render(wrapper(<NoteList currentDate={moment()} onTodayClick={todayCb} />));

    act(() => {
      screen.getByText("Today").click();
    });

    expect(todayCb).toBeCalled();
  });

  it("posts a note change message on note click", async () => {
    render(wrapper(<NoteList currentDate={moment()} />));

    await waitFor(() => expect(screen.getByText("Test Title")).toBeDefined());

    act(() => {
      screen.getByText("Test Title").click();
    });

    expect(postMessageMock).toBeCalled();
  });

  it("sorts notes by time", async () => {
    postMessageMock.mockReturnValue([
      {
        id: "testId1",
        title: "Test Title 1",
        createdTime: "1",
      },
      {
        id: "testId2",
        title: "Test Title 2",
        createdTime: "2",
      },
    ]);

    render(
      wrapper(
        <NoteList
          currentDate={moment()}
          defaultSortBy="time"
          defaultSortDirection="descending"
        />
      )
    );
    await waitFor(() => expect(screen.getByText("Test Title 2")).toBeDefined());

    expect(
      screen
        .getByText("Test Title 2")
        .compareDocumentPosition(screen.getByText("Test Title 1"))
    ).toBe(DOCUMENT_FOLLOWING);

    act(() => {
      screen.getByRole("button", { name: "sort-direction-button" }).click();
    });

    expect(
      screen
        .getByText("Test Title 1")
        .compareDocumentPosition(screen.getByText("Test Title 2"))
    ).toBe(DOCUMENT_FOLLOWING);
  });

  it("sorts notes alphabetically", async () => {
    postMessageMock.mockReturnValue([
      {
        id: "testId1",
        title: "A Note",
        createdTime: "1",
      },
      {
        id: "testId2",
        title: "B Note",
        createdTime: "2",
      },
    ]);

    render(
      wrapper(
        <NoteList
          currentDate={moment()}
          defaultSortBy="alphabetical"
          defaultSortDirection="ascending"
        />
      )
    );
    await waitFor(() => expect(screen.getByText("A Note")).toBeDefined());

    expect(
      screen
        .getByText("A Note")
        .compareDocumentPosition(screen.getByText("B Note"))
    ).toBe(DOCUMENT_FOLLOWING);

    act(() => {
      screen.getByRole("button", { name: "sort-direction-button" }).click();
    });

    expect(
      screen
        .getByText("B Note")
        .compareDocumentPosition(screen.getByText("A Note"))
    ).toBe(DOCUMENT_FOLLOWING);
  });

  it("does not show modified notes if setting is disabled", async () => {
    mockedUseNoteSearchTypes.mockReturnValue([NoteSearchTypes.Created]);

    render(wrapper(<NoteList currentDate={moment()} />));

    expect(screen.queryByText("Modified Notes")).toBeNull();
    expect(screen.getByText("Created Notes")).toBeDefined();
  });

  it("shows modified notes if setting is enabled", async () => {
    mockedUseNoteSearchTypes.mockReturnValue([
      NoteSearchTypes.Created,
      NoteSearchTypes.Modified,
    ]);

    render(wrapper(<NoteList currentDate={moment()} />));

    expect(screen.getByText("Modified Notes")).toBeDefined();
    expect(screen.getByText("Created Notes")).toBeDefined();
  });

  it("can show different notes in modified and created lists", async () => {
    mockedUseNoteSearchTypes.mockReturnValue([
      NoteSearchTypes.Created,
      NoteSearchTypes.Modified,
    ]);
    postMessageMock.mockImplementation(async (options) => {
      if (options.noteSearchTypes.includes(NoteSearchTypes.Created)) {
        return [
          {
            id: "testId1",
            title: "Created Note A",
            createdTime: "1",
          },
        ];
      }
      if (options.noteSearchTypes.includes(NoteSearchTypes.Modified)) {
        console.error("THIS");
        return [
          {
            id: "testId2",
            title: "Modified Note A",
            createdTime: "2",
          },
        ];
      }
    });

    render(wrapper(<NoteList currentDate={moment()} />));

    await waitFor(() =>
      expect(screen.getByText("Created Note A")).toBeDefined()
    );

    expect(screen.getAllByText("Created Note A")).toHaveLength(1);
    expect(screen.getAllByText("Modified Note A")).toHaveLength(1);
  });
});
