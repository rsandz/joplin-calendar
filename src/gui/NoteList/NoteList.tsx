import React, { useEffect, useState } from "react";
import SortButtonBar, { SortBy, SortDirection } from "./SortButtonBar";
import Button from "../StyledComponents/Button";
import styled from "styled-components";
import ButtonBar from "../StyledComponents/ButtonBar";
import PlainText from "../StyledComponents/PlainText";
import Note from "@constants/Note";
import MsgType from "@constants/messageTypes";
import { useQuery } from "@tanstack/react-query";
import NoteListItems from "./NoteListItems";
import { PluginPostMessage } from "@constants/pluginMessageTypes";
import useWebviewApiOnMessage from "../hooks/useWebViewApiOnMessage";

const ButtonBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const DateButtonBar = styled(ButtonBar)`
  flex-grow: 1;
`;

const TodayButton = styled(Button)`
  flex-grow: 0;
`;

const NoteListDate = styled(PlainText)`
  flex-grow: 2;
  flex-basis: 50%;
  font-weight: bold;
  text-align: center;
  font-size: var(--joplin-font-size);
`;

export interface NoteListProps {
  currentDate: moment.Moment;
  onNextDayClick?: () => void;
  onPreviousDayClick?: () => void;
  onTodayClick?: () => void;
  defaultSortBy?: SortBy;
  defaultSortDirection?: SortDirection;
}

function NoteList(props: NoteListProps) {
  const currentDate = props.currentDate.clone();
  const { onNextDayClick, onPreviousDayClick, onTodayClick } = props;

  const [sortBy, setSortBy] = useState<SortBy>(props.defaultSortBy ?? "time");
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    props.defaultSortDirection ?? "ascending"
  );

  const { data, refetch } = useQuery<Note[]>({
    queryKey: ["notes", currentDate.toISOString()],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
      });
    },
  });

  const { data: selectedNote, refetch: refetchSelectedNote } = useQuery<Note>({
    queryKey: ["selectedNote"],
    queryFn: async () => {
      return await webviewApi.postMessage({
        type: MsgType.GetSelectedNote,
      });
    },
  });

  useWebviewApiOnMessage((data) => {
    const message = data.message;
    if (message.type === MsgType.NoteChanged) {
      refetch();
      refetchSelectedNote();
    }
  });

  return (
    <>
      <ButtonBarContainer>
        <DateButtonBar>
          <Button onClick={onPreviousDayClick}>&lt;</Button>
          <NoteListDate>{currentDate.format("MMM D, YYYY")}</NoteListDate>
          <Button onClick={onNextDayClick}>&gt;</Button>
        </DateButtonBar>
        <TodayButton onClick={onTodayClick}>Today</TodayButton>
        <SortButtonBar
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByClick={setSortBy}
          onSortDirectionClick={setSortDirection}
        />
      </ButtonBarContainer>
      <NoteListItems
        notes={data ?? []}
        selectedNoteId={selectedNote?.id}
        sortBy={sortBy}
        sortDirection={sortDirection}
        key={currentDate.toISOString()}
      />
    </>
  );
}

export default NoteList;
