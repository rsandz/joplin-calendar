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
});
