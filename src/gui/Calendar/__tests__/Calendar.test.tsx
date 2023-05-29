import React from "react";
import { render, screen } from "@testing-library/react";
import Calendar from "..";
import moment from "moment";
import { act } from "react-dom/test-utils";

describe("calendar", () => {
  it("displays dates correctly", () => {
    const date = moment("May-29-2023", "MMM-DD-YYYY");
    render(<Calendar initialDate={date} />);

    expect(screen.getByText("May, 2023")).toBeDefined();
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
});
