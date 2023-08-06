import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useCallback } from "react";
import MsgType from "@constants/messageTypes";
import Note from "@constants/Note";
import NoteListItem from "./NoteListItem";
import styled from "styled-components";
import { PluginPostMessage as PluginPostData } from "@constants/pluginMessageTypes";
import ButtonBar from "../StyledComponents/ButtonBar";
import Button from "../StyledComponents/Button";
import PlainText from "../StyledComponents/PlainText";

const NoteListContainer = styled.ul`
  padding: 0;
`;

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
}

function NoteList(props: NoteListProps) {
  const currentDate = props.currentDate.clone();
  const { onNextDayClick, onPreviousDayClick, onTodayClick } = props;

  const { isSuccess, data, refetch } = useQuery<Note[]>({
    queryKey: ["notes", currentDate.toISOString()],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
      });
    },
  });

  webviewApi.onMessage((data: PluginPostData) => {
    const message = data.message;
    if (message.type === MsgType.NoteChanged) {
      refetch();
    } else {
      console.error(
        `Unknown plugin message received: ${JSON.stringify(message)}`
      );
    }
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

    if (noteItems.length === 0) {
      noteItems.push(<PlainText>No Notes Found</PlainText>);
    }
  }

  return (
    <>
      <ButtonBarContainer>
        <DateButtonBar>
          <Button onClick={onPreviousDayClick}>&lt;</Button>
          <NoteListDate>{currentDate.format("MMM D, YYYY")}</NoteListDate>
          <Button onClick={onNextDayClick}>&gt;</Button>
        </DateButtonBar>
        <TodayButton onClick={onTodayClick}>Today</TodayButton>
      </ButtonBarContainer>
      <NoteListContainer>{noteItems}</NoteListContainer>
    </>
  );
}

export default NoteList;
