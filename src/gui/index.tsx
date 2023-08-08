import React, {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useState,
} from "react";
import { render } from "react-dom";
import Calendar from "./Calendar";
import moment from "moment";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NoteList from "./NoteList";

const queryClient = new QueryClient();

function App() {
  const [selectedDate, setSelectedDateBase] = useState(moment());
  const [shownMonth, setShownMonth] = useState(moment());

  const setSelectedDate = (date: moment.Moment) => {
    setSelectedDateBase(date);
    setShownMonth(date);
  };

  const onCalendarKeyBoardNavigation = useCallback(
    (event: ReactKeyboardEvent) => {
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
    <QueryClientProvider client={queryClient}>
      <Calendar
        selectedDate={selectedDate}
        shownMonth={shownMonth}
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
    </QueryClientProvider>
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
  <AppStyler>
    <App />
  </AppStyler>,
  root
);
