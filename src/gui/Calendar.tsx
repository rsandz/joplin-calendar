import moment, { weekdaysShort } from "moment";
import React, { useState } from "react";
import styled from "styled-components";

const DAYS_IN_A_WEEK = 7;
const CALENDAR_ROWS = 5;

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CalendarNavButton = styled.button`
  flex-grow: 1;
`;

const CalendarDateHeader = styled.p`
  flex-grow: 2;
`;

interface CalendarProps {
  initialDate: moment.Moment;
}

/**
 * Creates the calendar to display.
 */
function Calendar({ initialDate }: CalendarProps) {
  const [currentDate, setState] = useState<moment.Moment>(initialDate.clone());
  const currentMonthFirstDay = currentDate.startOf("month");

  const calendarHeader = weekdaysShort().map((day) => <th>{day}</th>);

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
      workingDate.add(1, "day");
      cols.push(<td>{day}</td>);
    }
    calendarBody.push(<tr>{...cols}</tr>);
  }

  return (
    <div>
      <table>
        <tr>
          <th colSpan={7}>
            <ButtonBar>
              <CalendarNavButton
                onClick={() => setState(currentDate.clone().add(-1, "month"))}
              >
                &lt;
              </CalendarNavButton>
              <CalendarDateHeader>
                {currentDate.format("MMM, YYYY")}
              </CalendarDateHeader>
              <CalendarNavButton
                onClick={() => setState(currentDate.clone().add(1, "month"))}
              >
                &gt;
              </CalendarNavButton>
            </ButtonBar>
          </th>
        </tr>
        <tr>{calendarHeader}</tr>
        {...calendarBody}
      </table>
    </div>
  );
}

export default Calendar;
