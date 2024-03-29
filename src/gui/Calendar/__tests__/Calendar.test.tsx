import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Calendar from "..";
import moment from "moment";
import { act } from "react-dom/test-utils";
import useGetMonthStatistics from "../../hooks/useGetMonthStatistics";
import useWebviewApiOnMessage from "../../hooks/useWebViewApiOnMessage";
import { WeekStartDay } from "@constants/Settings";
import useOnSettingsChange from "../../hooks/useOnSettingsChange";

jest.mock("../../hooks/useGetMonthStatistics");
const mockedUseGetMonthStatistics = jest.mocked(useGetMonthStatistics);

jest.mock("../../hooks/useOnSettingsChange");
const mockedUseOnSettingsChange = jest.mocked(useOnSettingsChange);

global.webviewApi = {
  postMessage: jest.fn(),
  onMessage: jest.fn(),
};

jest.mock("../../hooks/useWebViewApiOnMessage");
const mockedUseWebviewApiOnMessage = jest.mocked(useWebviewApiOnMessage);

describe("calendar", () => {
  beforeEach(() => {
    mockedUseGetMonthStatistics.mockReturnValue({
      data: {
        notesPerDay: {},
      },
      refetch: jest.fn(),
    });
    mockedUseOnSettingsChange.mockReset();
  });

  it("displays dates correctly", () => {
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(<Calendar selectedDate={date} />);

    expect(screen.getByText("May 2023")).toBeDefined();

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(42); // 7 days * 6 rows

    // Assert April
    expect(cells[0].textContent).toEqual("30");

    // Assert May
    for (let i = 1; i <= 31; i++) {
      expect(cells[i].textContent).toEqual(i.toString());
    }

    // Assert June
    for (let i = 1; i <= 10; i++) {
      expect(cells[i + 31].textContent).toEqual(i.toString());
    }
  });

  it("displays dates correctly if week starts on Monday", () => {
    mockedUseOnSettingsChange.mockReturnValue(WeekStartDay.Monday);

    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(<Calendar selectedDate={date} />);

    expect(screen.getByText("May 2023")).toBeDefined();

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(42); // 7 days * 6 rows

    // Assert May (No April)
    for (let i = 0; i <= 30; i++) {
      expect(cells[i].textContent).toEqual((i + 1).toString());
    }

    // Assert June
    for (let i = 1; i <= 11; i++) {
      expect(cells[i + 30].textContent).toEqual(i.toString());
    }
  });

  it("calls callback when next month clicked", () => {
    const nextMonthCallback = jest.fn();
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(
      <Calendar selectedDate={date} onNextMonthClick={nextMonthCallback} />
    );

    const nextMonthButton = screen.getByRole("button", {
      name: "calendar-next",
    });

    act(() => {
      nextMonthButton.click();
    });

    expect(nextMonthCallback).toBeCalled();
  });

  it("calls callback when previous month clicked", () => {
    const previousMonthCallback = jest.fn();
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(
      <Calendar
        selectedDate={date}
        onPreviousMonthClick={previousMonthCallback}
      />
    );

    const previousMonthButton = screen.getByRole("button", {
      name: "calendar-previous",
    });

    act(() => {
      previousMonthButton.click();
    });

    expect(previousMonthCallback).toBeCalled();
  });

  // Broken because of https://github.com/testing-library/jest-dom/issues/322
  it.skip("highlights the currently selected date", () => {
    const date = moment("May-29-2023", "MMMM-DD-YYYY");
    render(<Calendar selectedDate={date} />);

    const dateCell = screen.getByText("29");

    expect(dateCell).toHaveStyle(
      "background-color: var(--joplin-background-color-hover3)"
    );
  });

  // Broken because of https://github.com/testing-library/jest-dom/issues/322
  it.skip("adds a border to the current day", () => {
    const date = moment("May-29-2023", "MMMM-DD-YYYY");
    render(<Calendar selectedDate={date} currentDay={date} />);

    const dateCell = screen.getByText("29");

    expect(dateCell).toHaveStyle("border: var(--joplin-color-correct)");
  });

  it("triggers onDataSelect callback when date cell clicked", () => {
    const date = moment("May-29-2023", "MMMM-DD-YYYY");
    const onDateSelectCb = jest.fn();
    render(<Calendar selectedDate={date} onDateSelect={onDateSelectCb} />);

    act(() => {
      screen.getByText("28").click();
    });

    expect(onDateSelectCb).toHaveBeenCalled();
  });
});
