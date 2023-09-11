import Note from "@constants/Note";
import React from "react";
import styled, { css } from "styled-components";
import { escape } from "lodash";
import PlainText from "../StyledComponents/PlainText";
import moment from "moment";

const NoteItemContainer = styled.li<{ selected?: boolean }>`
  display: flex;
  flex-direction: row;
  margin: 0;
  /** 0.5rem general padding + 0.5rem extra padding on bottom */
  padding: 0.5rem 0.5rem 0.5rem 1rem;

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

const NoteItemBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  margin: 0;
  margin-bottom: 0.25rem;
  font-size: var(--joplin-font-size);
  background-color: transparent;
  cursor: default;
`;

const InfoBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 0.25rem;
  font-size: calc(var(--joplin-font-size) * 0.95);
`;

const InfoText = styled(PlainText)`
  display: flex;
  align-items: center;
  padding-top: 0.125rem;
  margin: 0;
  background-color: transparent;
  font-size: inherit;
`;

export interface NoteListItemProps {
  note: Note;
  onNoteClick?: () => void;
  isSelected?: boolean;
}

function NoteItem({ note, onNoteClick, isSelected }: NoteListItemProps) {
  const time = moment(note.createdTime, moment.ISO_8601).format("LT");

  return (
    <NoteItemContainer onClick={onNoteClick} selected={isSelected}>
      <NoteItemBody>
        <Title>{escape(note.title) || <i>Untitled</i>}</Title>
        <InfoBar>
          <InfoText title="Time">{time}</InfoText>
        </InfoBar>
      </NoteItemBody>
    </NoteItemContainer>
  );
}

export default NoteItem;
