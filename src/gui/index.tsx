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
import NoteSearchTypes from "@constants/NoteSearchTypes";

const queryClient = new QueryClient();

async function getNearestFutureDayWithNote(
  selectedDate: moment.Moment,
  noteSearchTypes: NoteSearchTypes[]
): Promise<moment.Moment | null> {
  const response = await webviewApi.postMessage({
    type: MsgType.GetNearestDayWithNote,
    date: selectedDate.toISOString(),
    direction: "future",
    noteSearchTypes,
  } as GetNearestDayWithNoteRequest);

  if (!response) {
    return null;
  }

  return moment(response.date, ISO_8601);
}

async function getNearestPastDayWithNote(
  selectedDate: moment.Moment,
  noteSearchTypes: NoteSearchTypes[]
): Promise<moment.Moment | null> {
  const response = await webviewApi.postMessage({
    type: MsgType.GetNearestDayWithNote,
    date: selectedDate.toISOString(),
    direction: "past",
    noteSearchTypes,
  } as GetNearestDayWithNoteRequest);

  if (!response) {
    return null;
  }

  return moment(response.date, ISO_8601);
}

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
        let date: moment.Moment | null;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          date = await getNearestPastDayWithNote(selectedDate, noteSearchTypes);
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          date = await getNearestFutureDayWithNote(
            selectedDate,
            noteSearchTypes
          );
        }

        if (!date) {
          return;
        }

        setSelectedDate(date);
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
    [selectedDate, setSelectedDate, noteSearchTypes]
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
        onNextYearClick={() => {
          setShownMonth(shownMonth.clone().add(1, "year"));
        }}
        onPreviousMonthClick={() => {
          setShownMonth(shownMonth.clone().subtract(1, "month"));
        }}
        onPreviousYearClick={() => {
          setShownMonth(shownMonth.clone().subtract(1, "year"));
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
        onNextNoteDayClick={async () => {
          let date = await getNearestFutureDayWithNote(
            selectedDate,
            noteSearchTypes
          );
          if (!date) {
            return;
          }
          setSelectedDate(date);
        }}
        onPreviousDayClick={() => {
          const newDate = selectedDate.clone().subtract(1, "day");
          setSelectedDate(newDate);
        }}
        onPreviousNoteDayClick={async () => {
          let date = await getNearestPastDayWithNote(
            selectedDate,
            noteSearchTypes
          );
          if (!date) {
            return;
          }
          setSelectedDate(date);
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
  height: 100vh;
  display: flex;
  flex-direction: column;
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
