import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Calendar from "..";
import moment from "moment";
import { act } from "react-dom/test-utils";

describe("calendar", () => {
  it("displays dates correctly", () => {
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(<Calendar initialDate={date} />);

    expect(screen.getByText("May, 2023")).toBeDefined();

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(35); // 7 days * 5 rows

    // Assert April
    expect(cells[0].textContent).toEqual("30");

    // Assert May
    for (let i = 1; i <= 31; i++) {
      expect(cells[i].textContent).toEqual(i.toString());
    }

    // Assert June
    for (let i = 1; i <= 3; i++) {
      expect(cells[i + 31].textContent).toEqual(i.toString());
    }
  });

  it("can navigate to next month", () => {
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(<Calendar initialDate={date} />);

    const nextMonthButton = screen.getByRole("button", { name: ">" });

    act(() => {
      nextMonthButton.click();
    });

    expect(screen.getByText("Jun, 2023")).toBeDefined();
  });

  it("can navigate to previous month", () => {
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(<Calendar initialDate={date} />);

    const previousMonthButton = screen.getByRole("button", { name: "<" });

    act(() => {
      previousMonthButton.click();
    });

    expect(screen.getByText("Apr, 2023")).toBeDefined();
  });

  // Broken because of https://github.com/testing-library/jest-dom/issues/322
  it.skip("highlights the currently selected date", () => {
    const date = moment("May-29-2023", "MMMM-DD-YYYY");
    render(<Calendar initialDate={date} />);

    const dateCell = screen.getByText("29");

    expect(dateCell).toHaveStyle(
      "background-color: var(--joplin-background-color-hover3)"
    );
  });

  // Broken because of https://github.com/testing-library/jest-dom/issues/322
  it.skip("adds a border to the current day", () => {
    const date = moment("May-29-2023", "MMMM-DD-YYYY");
    render(<Calendar initialDate={date} currentDay={date} />);

    const dateCell = screen.getByText("29");

    expect(dateCell).toHaveStyle("border: var(--joplin-color-correct)");
  });

  it("triggers onDataSelect callback when date cell clicked", () => {
    const date = moment("May-29-2023", "MMMM-DD-YYYY");
    const onDateSelectCb = jest.fn();
    render(<Calendar initialDate={date} onDateSelect={onDateSelectCb} />);

    act(() => {
      screen.getByText("28").click();
    });

    expect(onDateSelectCb).toHaveBeenCalled();
  });
});
