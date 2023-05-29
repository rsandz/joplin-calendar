import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import CalendarControls from "./CalendarControls";
import CalendarCell from "./CalendarCell";
import CalendarHeader from "./CalendarHeader";

const DAYS_IN_A_WEEK = 7;
const CALENDAR_ROWS = 5;

const CalendarTable = styled.table`
  margin-top: 0.5rem;
  width: 100%;
  border-collapse: collapse;
`;

interface CalendarProps {
  initialDate: moment.Moment;
}

/**
 * Creates the calendar to display.
 */
function Calendar({ initialDate }: CalendarProps) {
  const [currentDate, setDate] = useState<moment.Moment>(initialDate.clone());
  const currentMonthFirstDay = currentDate.startOf("month");

  const calendarBody: React.JSX.Element[] = [];
  const firstRowOffset = -currentMonthFirstDay.weekday();

  // Note: Moment JS uses in place operations
  const workingDate = currentMonthFirstDay.clone();

  // Offset to fill in dates from previous month till first of current month.
  workingDate.add(firstRowOffset, "days");

  for (let row = 0; row < CALENDAR_ROWS; row++) {
    const cols: React.JSX.Element[] = [];
    for (let col = 0; col < DAYS_IN_A_WEEK; col++) {
      const day = workingDate.format("DD");
      const inCurrentMonth = currentDate.month() === workingDate.month();
      workingDate.add(1, "day");
      cols.push(<CalendarCell day={day} muted={!inCurrentMonth} />);
    }
    calendarBody.push(<tr>{...cols}</tr>);
  }

  return (
    <div>
      <CalendarTable>
        <CalendarControls
          currentDate={currentDate}
          onNextMonthClicked={() =>
            setDate(currentDate.clone().add(1, "month"))
          }
          onPreviousMonthClicked={() =>
            setDate(currentDate.clone().add(-1, "month"))
          }
        />
        <CalendarHeader />
        {...calendarBody}
      </CalendarTable>
    </div>
  );
}

export default Calendar;
