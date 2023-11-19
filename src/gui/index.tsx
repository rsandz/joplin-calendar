import React, {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useState,
} from "react";
import { render } from "react-dom";
import Calendar from "./Calendar";
import moment, { ISO_8601 } from "moment";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NoteList from "./NoteList";
import useGetMonthStatistics from "./hooks/useGetMonthStatistics";
import {
  GetNearestDayWithNoteRequest,
  GetNearestDayWithNoteResponse,
} from "@constants/GetNearestDayWithNote";
import MsgType from "@constants/messageTypes";
import useNoteSearchTypes from "./hooks/useNoteSearchTypes";

const queryClient = new QueryClient();

function App() {
  const [selectedDate, setSelectedDateBase] = useState(moment());
  const [shownMonth, setShownMonth] = useState(moment());

  const previousMonth = shownMonth.clone().subtract(1, "month");
  const nextMonth = shownMonth.clone().add(1, "month");

  const noteSearchTypes = useNoteSearchTypes();

  const { data: previousMonthStats, refetch: refetchPreviousMonthStats } =
    useGetMonthStatistics(previousMonth.clone(), noteSearchTypes);
  const { data: shownMonthStats, refetch: refetchShownMonthStats } =
    useGetMonthStatistics(shownMonth.clone(), noteSearchTypes);
  const { data: nextMonthStats, refetch: refetchNextMonthStats } =
    useGetMonthStatistics(nextMonth.clone(), noteSearchTypes);

  let statistics: Record<string, number> = {};

  if (previousMonthStats && shownMonthStats && nextMonthStats) {
    statistics = {
      ...previousMonthStats.notesPerDay,
      ...shownMonthStats.notesPerDay,
      ...nextMonthStats.notesPerDay,
    };
  }

  const setSelectedDate = (date: moment.Moment) => {
    setSelectedDateBase(date);
    setShownMonth(date);
  };

  const onCalendarKeyBoardNavigation = useCallback(
    async (event: ReactKeyboardEvent) => {
      if (event.ctrlKey) {
        let response: GetNearestDayWithNoteResponse;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          response = await webviewApi.postMessage({
            type: MsgType.GetNearestDayWithNote,
            date: selectedDate.toISOString(),
            direction: "past",
            noteSearchTypes,
          } as GetNearestDayWithNoteRequest);
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          response = await webviewApi.postMessage({
            type: MsgType.GetNearestDayWithNote,
            date: selectedDate.toISOString(),
            direction: "future",
            noteSearchTypes,
          } as GetNearestDayWithNoteRequest);
        }

        if (!response) {
          return;
        }

        setSelectedDate(moment(response.date, ISO_8601));
        return;
      }

      if (event.key === "ArrowLeft") {
        setSelectedDate(selectedDate.clone().subtract(1, "day"));
      } else if (event.key === "ArrowRight") {
        setSelectedDate(selectedDate.clone().add(1, "day"));
      } else if (event.key === "ArrowUp") {
        setSelectedDate(selectedDate.clone().subtract(1, "week"));
      } else if (event.key === "ArrowDown") {
        setSelectedDate(selectedDate.clone().add(1, "week"));
      }
    },
    [selectedDate, setSelectedDate]
  );

  return (
    <>
      <Calendar
        selectedDate={selectedDate}
        shownMonth={shownMonth}
        statistics={statistics}
        onDateSelect={(date) => setSelectedDate(date)}
        onNextMonthClick={() => {
          setShownMonth(shownMonth.clone().add(1, "month"));
        }}
        onPreviousMonthClick={() => {
          setShownMonth(shownMonth.clone().subtract(1, "month"));
        }}
        onKeyboardNavigation={onCalendarKeyBoardNavigation}
      />
      <hr />
      <NoteList
        currentDate={selectedDate}
        onNextDayClick={() => {
          const newDate = selectedDate.clone().add(1, "day");
          setSelectedDate(newDate);
        }}
        onPreviousDayClick={() => {
          const newDate = selectedDate.clone().subtract(1, "day");
          setSelectedDate(newDate);
        }}
        onTodayClick={() => {
          setSelectedDate(moment());
        }}
      />
    </>
  );
}

const AppStyler = styled.div`
  background-color: var(--joplin-background-color);
  color: var(--joplin-color);
  font-size: var(--joplin-font-size);
  font-family: var(--joplin-font-family);
  margin: 0.25rem 0.5rem 0.25rem 0.5rem;
`;

const root = document.getElementById("joplin-plugin-content");

render(
  <QueryClientProvider client={queryClient}>
    <AppStyler>
      <App />
    </AppStyler>
  </QueryClientProvider>,
  root
);
