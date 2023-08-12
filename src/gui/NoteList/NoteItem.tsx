import Note from "@constants/Note";
import React from "react";
import styled, { css } from "styled-components";
import { escape } from "lodash";

const NoteItemContainer = styled.li<{ selected?: boolean }>`
  display: flex;
  padding: 0 0 0 0.5rem;

  &:not(:first-child) {
    border-top: 1px solid var(--joplin-divider-color);
  }

  &:hover {
    background-color: var(--joplin-background-color-hover3);
  }

  ${({ selected }) =>
    selected &&
    css`
      background-color: var(--joplin-background-color-hover3);
    `}
`;

const Title = styled.h4`
  font-size: var(--joplin-font-size);
  margin: 1rem;
  cursor: default;
`;

export interface NoteListItemProps {
  note: Note;
  onNoteClick?: () => void;
  isSelected?: boolean;
}

function NoteItem({ note, onNoteClick, isSelected }: NoteListItemProps) {
  return (
    <NoteItemContainer onClick={onNoteClick} selected={isSelected}>
      <Title>{escape(note.title)}</Title>
    </NoteItemContainer>
  );
}

export default NoteItem;
