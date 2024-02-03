import moment from "moment";
import React, {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import CalendarControls from "./CalendarControls";
import CalendarCell from "./CalendarCell";
import CalendarHeader from "./CalendarHeader";
import { useQuery } from "@tanstack/react-query";
import MonthStatistics from "@constants/MonthStatistics";
import useGetMonthStatistics from "../hooks/useGetMonthStatistics";
import MsgType from "@constants/messageTypes";
import { PluginPostMessage } from "@constants/pluginMessageTypes";
import useWebviewApiOnMessage from "../hooks/useWebViewApiOnMessage";
import useOnSettingsChange from "../hooks/useOnSettingsChange";
import { WEEK_START_DAY, WeekStartDay } from "@constants/Settings";

const DAYS_IN_A_WEEK = 7;
const CALENDAR_ROWS = 6;

const CalendarTable = styled.table`
  margin-top: 0.5rem;
  width: 100%;
  border-spacing: 0;
  table-layout: fixed;
`;

function calculateNumberOfDots(numberOfNotes) {
  return Math.ceil(numberOfNotes / 3);
}

interface CalendarProps {
  selectedDate: moment.Moment;
  shownMonth?: moment.Moment;
  currentDay?: moment.Moment;
  // Statistics map with `MM/DD/YYYY` as key and arbitrary number as value.
  statistics?: Record<string, number>;
  onDateSelect?: (date: moment.Moment) => void;
  onNextMonthClick?: () => void;
  onNextYearClick?: () => void;
  onPreviousMonthClick?: () => void;
  onPreviousYearClick?: () => void;
  onKeyboardNavigation?: (event: ReactKeyboardEvent) => void;
}

/**
 * Creates the calendar to display.
 */
function Calendar({
  selectedDate,
  shownMonth: shownMonthProp,
  currentDay: currentDayProp,
  statistics,
  onDateSelect,
  onNextMonthClick,
  onNextYearClick,
  onPreviousMonthClick,
  onPreviousYearClick,
  onKeyboardNavigation,
}: CalendarProps) {
  const currentDay = currentDayProp ? currentDayProp.clone() : moment();
  const shownMonth = shownMonthProp
    ? shownMonthProp.clone()
    : selectedDate.clone();

  const onDateCellSelected = useCallback(
    (date: moment.Moment) => {
      onDateSelect?.(date);
    },
    [onDateSelect]
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      onKeyboardNavigation(event);
    },
    [onKeyboardNavigation]
  );

  const weekStartDay = useOnSettingsChange<WeekStartDay>(
    WEEK_START_DAY,
    WeekStartDay.Sunday
  );

  const currentMonthFirstDay = shownMonth.startOf("month");

  const calendarBody: React.JSX.Element[] = [];
  let firstRowBacktrackOffset;
  if (weekStartDay === WeekStartDay.Monday) {
    // If the current month starts on a day other than Monday, we need to backtrack.
    // Monday has isoWeek 1, and we need to  backtrack 0 days.
    // Tuesday has isoWeek 2, and we need to backtrack 1 days.
    // ...
    // Sunday has isoWeek 7, and we need to backtrack 6 days.
    firstRowBacktrackOffset = currentMonthFirstDay.isoWeekday() - 1;
  } else {
    // Fallback to asssuming week starts on Sunday.
    // If current month starts on a day other than Sunday, we need to backtrack.
    // Monday has isoWeek 1, and we need to  backtrack 1 day.
    // Tuesday has isoWeek 2, and we need to backtrack 2 days.
    // ...
    // Sunday has isoWeek 7, and we need to backtrack no days.
    firstRowBacktrackOffset = currentMonthFirstDay.isoWeekday() % 7;
  }

  // Note: Moment JS uses in place operations
  const workingDate = currentMonthFirstDay.clone();

  // Offset to fill in dates from previous month till first of current month.
  workingDate.subtract(firstRowBacktrackOffset, "days");

  for (let row = 0; row < CALENDAR_ROWS; row++) {
    const cols: React.JSX.Element[] = [];
    for (let col = 0; col < DAYS_IN_A_WEEK; col++) {
      const inCurrentMonth = workingDate.isSame(shownMonth, "month");
      const simpleWorkingDate = workingDate.format("L");

      let numberOfDots = 0;

      if (statistics && statistics[simpleWorkingDate]) {
        numberOfDots = calculateNumberOfDots(statistics[simpleWorkingDate]);
      }

      numberOfDots = Math.min(numberOfDots, 4);

      cols.push(
        <CalendarCell
          date={workingDate.clone()}
          muted={!inCurrentMonth}
          selected={selectedDate.isSame(workingDate, "date")}
          currentDay={currentDay.isSame(workingDate, "date")}
          onSelect={onDateCellSelected}
          numberOfDots={numberOfDots}
        />
      );
      workingDate.add(1, "day");
    }
    calendarBody.push(<tr>{...cols}</tr>);
  }

  return (
    <div tabIndex={0} style={{ outline: "none" }} onKeyDown={onKeyDown}>
      <CalendarTable>
        <thead>
          <CalendarControls
            shownMonth={shownMonth}
            onNextMonthClicked={onNextMonthClick}
            onNextYearClicked={onNextYearClick}
            onPreviousMonthClicked={onPreviousMonthClick}
            onPreviousYearClicked={onPreviousYearClick}
          />
          <CalendarHeader />
        </thead>
        <tbody>{...calendarBody}</tbody>
      </CalendarTable>
    </div>
  );
}

export default Calendar;
