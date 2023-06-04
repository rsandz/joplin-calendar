import Note from "@constants/Note";
import React, { useCallback } from "react";
import styled from "styled-components";
import { escape } from "lodash";

const NoteItemContainer = styled.li`
  display: flex;
  padding: 0 0 0 0.5rem;

  &:not(:first-child) {
    border-top: 1px solid var(--joplin-divider-color);
  }

  &:hover {
    background-color: var(--joplin-background-color-hover3);
  }
`;

const Title = styled.h4`
  font-size: var(--joplin-font-size);
  margin: 1rem;
  cursor: default;
`;

export interface NoteListItemProps {
  note: Note;
  onNoteClick?: (note: Note) => void;
}

function NoteListItem({ note, onNoteClick }: NoteListItemProps) {
  const handleOnClick = useCallback(() => {
    onNoteClick?.(note);
  }, [note, onNoteClick]);

  return (
    <NoteItemContainer onClick={handleOnClick}>
      <Title>{escape(note.title)}</Title>
    </NoteItemContainer>
  );
}

export default NoteListItem;
