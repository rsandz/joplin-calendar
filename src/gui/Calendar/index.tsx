import moment from "moment";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import CalendarControls from "./CalendarControls";
import CalendarCell from "./CalendarCell";
import CalendarHeader from "./CalendarHeader";

const DAYS_IN_A_WEEK = 7;
const CALENDAR_ROWS = 5;

const CalendarTable = styled.table`
  margin-top: 0.5rem;
  width: 100%;
  border-spacing: 0;
`;

interface CalendarProps {
  initialDate: moment.Moment;
  currentDay?: moment.Moment;
  onDateSelect?: (date: moment.Moment) => void;
}

/**
 * Creates the calendar to display.
 */
function Calendar({
  initialDate,
  currentDay: currentDayProp,
  onDateSelect,
}: CalendarProps) {
  const [shownMonth, setShownMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const currentDay = currentDayProp ?? moment();

  const onDateCellSelected = useCallback(
    (date: moment.Moment) => {
      onDateSelect?.(date);
      setSelectedDate(date);
    },
    [onDateSelect, setSelectedDate]
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
    <div>
      <CalendarTable>
        <thead>
          <CalendarControls
            shownMonth={shownMonth}
            onNextMonthClicked={() => {
              const newDate = shownMonth.clone().add(1, "month");
              setShownMonth(newDate);
            }}
            onPreviousMonthClicked={() => {
              const newDate = shownMonth.clone().add(-1, "month");
              setShownMonth(newDate);
            }}
          />
          <CalendarHeader />
        </thead>
        <tbody>{...calendarBody}</tbody>
      </CalendarTable>
    </div>
  );
}

export default Calendar;
