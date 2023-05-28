import React from "react";
import { render } from "react-dom";
import Calendar from "./Calendar";
import moment from "moment";
import NoteList from "./NoteList";

function App() {
  return (
    <>
      <Calendar initialDate={moment()} />
      <NoteList />
    </>
  );
}

let root = document.getElementById("root");
if (!root) {
  root = document.createElement("div");
  document.body.appendChild(root);
}

render(<App />, root);
