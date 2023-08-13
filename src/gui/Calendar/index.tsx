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

  const previousMonth = shownMonth.clone().subtract(1, "month");
  const nextMonth = shownMonth.clone().add(1, "month");

  const { data: previousMonthStats, refetch: refetchPreviousMonthStats } =
    useGetMonthStatistics(previousMonth.clone());
  const { data: shownMonthStats, refetch: refetchShownMonthStats } =
    useGetMonthStatistics(shownMonth.clone());
  const { data: nextMonthStats, refetch: refetchNextMonthStats } =
    useGetMonthStatistics(nextMonth.clone());

  useWebviewApiOnMessage((data) => {
    const message = data.message;
    if (message.type === MsgType.NoteChanged) {
      refetchPreviousMonthStats();
      refetchShownMonthStats();
      refetchNextMonthStats();
    }
  });

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
      const inPreviousMonth = workingDate.isSame(previousMonth, "month");
      const inCurrentMonth = workingDate.isSame(shownMonth, "month");
      const inNextMonth = workingDate.isSame(nextMonth, "month");

      let numberOfDots = 0;
      if (inPreviousMonth && previousMonthStats) {
        numberOfDots = calculateNumberOfDots(
          previousMonthStats.notesPerDay[workingDate.format("L")]
        );
      } else if (inCurrentMonth && shownMonthStats) {
        numberOfDots = calculateNumberOfDots(
          shownMonthStats.notesPerDay[workingDate.format("L")]
        );
      } else if (inNextMonth && nextMonthStats) {
        numberOfDots = calculateNumberOfDots(
          nextMonthStats.notesPerDay[workingDate.format("L")]
        );
      }

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
