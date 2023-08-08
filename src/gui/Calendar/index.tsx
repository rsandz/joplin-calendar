import moment from "moment";
import React, {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useState,
} from "react";
import styled from "styled-components";
import CalendarControls from "./CalendarControls";
import CalendarCell from "./CalendarCell";
import CalendarHeader from "./CalendarHeader";

const DAYS_IN_A_WEEK = 7;
const CALENDAR_ROWS = 6;

const CalendarTable = styled.table`
  margin-top: 0.5rem;
  width: 100%;
  border-spacing: 0;
`;

interface CalendarProps {
  selectedDate: moment.Moment;
  shownMonth?: moment.Moment;
  currentDay?: moment.Moment;
  onDateSelect?: (date: moment.Moment) => void;
  onNextMonthClick?: () => void;
  onPreviousMonthClick?: () => void;
  onKeyboardNavigation?: (event: ReactKeyboardEvent) => void;
}

/**
 * Creates the calendar to display.
 */
function Calendar({
  selectedDate,
  shownMonth: shownMonthProp,
  currentDay: currentDayProp,
  onDateSelect,
  onNextMonthClick,
  onPreviousMonthClick,
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

  const currentMonthFirstDay = shownMonth.startOf("month");

  const calendarBody: React.JSX.Element[] = [];
  const firstRowOffset = -currentMonthFirstDay.weekday();

  // Note: Moment JS uses in place operations
  const workingDate = currentMonthFirstDay.clone();

  // Offset to fill in dates from previous month till first of current month.
  workingDate.add(firstRowOffset, "days");

  for (let row = 0; row < CALENDAR_ROWS; row++) {
    const cols: React.JSX.Element[] = [];
    for (let col = 0; col < DAYS_IN_A_WEEK; col++) {
      const inCurrentMonth = shownMonth.month() === workingDate.month();
      cols.push(
        <CalendarCell
          date={workingDate.clone()}
          muted={!inCurrentMonth}
          selected={selectedDate.isSame(workingDate, "date")}
          currentDay={currentDay.isSame(workingDate, "date")}
          onSelect={onDateCellSelected}
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
            onPreviousMonthClicked={onPreviousMonthClick}
          />
          <CalendarHeader />
        </thead>
        <tbody>{...calendarBody}</tbody>
      </CalendarTable>
    </div>
  );
}

export default Calendar;
