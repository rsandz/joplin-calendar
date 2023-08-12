import React, { useCallback, KeyboardEvent as ReactKeyboardEvent } from "react";
import MsgType from "@constants/messageTypes";
import styled from "styled-components";
import { SortBy, SortDirection } from "./SortButtonBar";
import Note from "@constants/Note";
import { toNumber } from "lodash";
import NoteItem from "./NoteItem";
import PlainText from "../StyledComponents/PlainText";

const NoteListContainer = styled.ul`
  padding: 0;
  outline: 0;
`;

export interface NoteListItemsProps {
  notes: Note[];
  selectedNoteId: string;
  sortBy: SortBy;
  sortDirection: SortDirection;
}

function NoteListItems(props: NoteListItemsProps) {
  const { notes, selectedNoteId, sortBy, sortDirection } = props;

  let sortedNotes: Note[] = [];
  let noteElements: React.JSX.Element[] = [];

  let sortCompareFunction: (a: Note, b: Note) => number;
  if (sortBy === "time") {
    if (sortDirection === "ascending") {
      sortCompareFunction = (a, b) =>
        toNumber(a.createdTime) - toNumber(b.createdTime);
    } else {
      sortCompareFunction = (a, b) =>
        toNumber(b.createdTime) - toNumber(a.createdTime);
    }
  } else if (sortBy === "alphabetical") {
    if (sortDirection === "ascending") {
      sortCompareFunction = (a, b) => a.title.localeCompare(b.title);
    } else {
      sortCompareFunction = (a, b) => b.title.localeCompare(a.title);
    }
  }

  sortedNotes = notes.sort(sortCompareFunction);
  noteElements = sortedNotes.map((note) => (
    <NoteItem
      note={note}
      onNoteClick={() => onSelectedNoteChange(note.id)}
      isSelected={note.id === selectedNoteId}
      key={note.id}
    />
  ));

  if (noteElements.length === 0) {
    noteElements.push(<PlainText key="0">No Notes Found</PlainText>);
  }

  const onSelectedNoteChange = useCallback(
    async (noteId: string) => {
      await webviewApi.postMessage({
        type: MsgType.OpenNote,
        id: noteId,
      });
    },
    [MsgType.OpenNote, sortedNotes]
  );

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      if (sortedNotes.length < 1) {
        return;
      }

      const selectedNoteIndex = sortedNotes.findIndex(
        (note) => note.id === selectedNoteId
      );

      if (event.key === "ArrowDown") {
        if (selectedNoteIndex < 0) {
          onSelectedNoteChange(sortedNotes[0].id);
        }
        if (selectedNoteIndex === sortedNotes.length - 1) {
          // Can't select more than last note.
          return;
        }
        onSelectedNoteChange(sortedNotes[selectedNoteIndex + 1].id);
      } else if (event.key === "ArrowUp") {
        if (selectedNoteIndex < 0) {
          onSelectedNoteChange(sortedNotes[sortedNotes.length - 1].id);
        }
        if (selectedNoteIndex === 0) {
          // Can't select more than first note.
          return;
        }
        onSelectedNoteChange(sortedNotes[selectedNoteIndex - 1].id);
      }
    },
    [sortedNotes, selectedNoteId, onSelectedNoteChange]
  );

  return (
    <NoteListContainer tabIndex={0} onKeyDown={onKeyDown}>
      {noteElements}
    </NoteListContainer>
  );
}

export default NoteListItems;
