import React, { useState } from "react";
import { render } from "react-dom";
import Calendar from "./Calendar";
import moment from "moment";
import NoteList from "./NoteList";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [selectedDate, setSelectedDate] = useState(moment());
  return (
    <QueryClientProvider client={queryClient}>
      <Calendar
        initialDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
      />
      <NoteList currentDate={selectedDate} />
    </QueryClientProvider>
  );
}

const StyledApp = styled(App)`
  background-color: var(--joplin-background-color);
  color: var(--joplin-color);
  font-size: var(--joplin-font-size);
  font-family: var(--joplin-font-family);
`;

let root = document.getElementById("root");
if (!root) {
  root = document.createElement("div");
  document.body.appendChild(root);
}

render(<App />, root);
