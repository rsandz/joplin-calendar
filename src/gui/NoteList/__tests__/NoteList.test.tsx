import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NoteList from "../NoteList";
import moment from "moment";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const postMessageMock = jest.fn();

// Mock Webview Api in global scope
global.webviewApi = {
  postMessage: postMessageMock,
  onMessage: jest.fn(),
};

const queryClient = new QueryClient();
function wrapper(children: React.JSX.Element) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("NoteList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    postMessageMock.mockImplementation(async () => {
      return Promise.resolve([
        {
          id: "testId",
          title: "Test Title",
          createdTime: "1",
        },
      ]);
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

  it("calls callback when next day button is clicked", () => {
    const nextDayCb = jest.fn();
    render(
      wrapper(<NoteList currentDate={moment()} onNextDayClick={nextDayCb} />)
    );

    act(() => {
      screen.getByText(">").click();
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
      screen.getByText("<").click();
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
});
