import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useCallback } from "react";
import MsgType from "@constants/messageTypes";
import Note from "@constants/Note";
import NoteListItem from "./NoteListItem";
import styled from "styled-components";

const NoteListContainer = styled.ul`
  padding: 0;
`;

export interface NoteListProps {
  currentDate: moment.Moment;
}

function NoteList(props: NoteListProps) {
  const currentDate = props.currentDate.clone();

  const { isSuccess, data } = useQuery<Note[]>({
    queryKey: ["notes", currentDate.toISOString()],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
      });
    },
  });

  const onNoteClick = useCallback(
    async (note: Note) => {
      await webviewApi.postMessage({
        type: MsgType.OpenNote,
        id: note.id,
      });
    },
    [MsgType.OpenNote]
  );

  let noteItems: React.JSX.Element[] = [];
  if (isSuccess) {
    noteItems = data.map((note) => (
      <NoteListItem note={note} onNoteClick={onNoteClick} />
    ));
  }

  return (
    <>
      <h1>{currentDate.format("MMM D, YYYY")}</h1>
      <NoteListContainer>{noteItems}</NoteListContainer>
    </>
  );
}

export default NoteList;
