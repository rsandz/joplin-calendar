import React, { useState } from "react";
import SortButtonBar, { SortBy, SortDirection } from "./SortButtonBar";
import Button from "../StyledComponents/Button";
import styled from "styled-components";
import ButtonBar from "../StyledComponents/ButtonBar";
import PlainText from "../StyledComponents/PlainText";
import Note from "@constants/Note";
import MsgType from "@constants/messageTypes";
import { useQuery } from "@tanstack/react-query";
import NoteListItems from "./NoteListItems";
import useWebviewApiOnMessage from "../hooks/useWebViewApiOnMessage";
import useNoteSearchTypes from "../hooks/useNoteSearchTypes";
import NoteSearchTypes from "@constants/NoteSearchTypes";
import moment from "moment";
import useControlHeld from "../hooks/useControlHeld";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRightToBracket,
} from "react-icons/fa6";
import useSelectedNote from "../hooks/useSelectedNote";

const ButtonBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const DateButtonBar = styled(ButtonBar)`
  flex-grow: 1;
`;

const TodayButton = styled(Button)`
  flex-grow: 0;
`;

const ListContainer = styled.div`
  overflow-y: auto;
`;

const NoteListDate = styled(PlainText)`
  flex-grow: 2;
  flex-basis: 50%;
  font-weight: bold;
  text-align: center;
  font-size: var(--joplin-font-size);
`;

const NoteTypeHeader = styled(PlainText)`
  font-weight: bold;
  font-size: calc(var(--joplin-font-size) * 1.25);
`;

export interface NoteListProps {
  currentDate: moment.Moment;
  onNextDayClick?: () => void;
  onNextNoteDayClick?: () => void;
  onPreviousDayClick?: () => void;
  onPreviousNoteDayClick?: () => void;
  onTodayClick?: () => void;
  defaultSortBy?: SortBy;
  defaultSortDirection?: SortDirection;
}

function NoteList(props: NoteListProps) {
  const controlHeld = useControlHeld();
  const currentDate = props.currentDate.clone();
  const {
    onNextDayClick,
    onNextNoteDayClick,
    onPreviousDayClick,
    onPreviousNoteDayClick,
    onTodayClick,
  } = props;

  const [sortBy, setSortBy] = useState<SortBy>(props.defaultSortBy ?? "time");
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    props.defaultSortDirection ?? "ascending"
  );

  const noteSearchTypes = useNoteSearchTypes();

  useWebviewApiOnMessage((data) => {
    const message = data.message;
    if (message.type === MsgType.NoteChanged) {
      refetchCreatedNotes();
      refetchModifiedNotes();
      refetchRelatedNotes();
    }
  });

  const { data: createdNotesData, refetch: refetchCreatedNotes } = useQuery<
    Note[]
  >({
    queryKey: ["notes", "created", currentDate.toISOString()],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
        noteSearchTypes: [NoteSearchTypes.Created],
      });
    },
    enabled: noteSearchTypes.includes(NoteSearchTypes.Created),
  });

  const { data: modifiedNotesData, refetch: refetchModifiedNotes } = useQuery<
    Note[]
  >({
    queryKey: ["notes", "modified", currentDate.toISOString()],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
        noteSearchTypes: [NoteSearchTypes.Modified],
      });
    },
    enabled: noteSearchTypes.includes(NoteSearchTypes.Modified),
  });

  const { data: relatedNotesData, refetch: refetchRelatedNotes } = useQuery<
    Note[]
  >({
    queryKey: ["notes", "related", currentDate.toISOString()],
    queryFn: async () => {
      console.debug(`Requesting notes for ${currentDate.toLocaleString()}`);
      return await webviewApi.postMessage({
        type: MsgType.GetNotes,
        currentDate: currentDate.toISOString(),
        noteSearchTypes: [NoteSearchTypes.Related],
      });
    },
    enabled: noteSearchTypes.includes(NoteSearchTypes.Related),
  });

  const { selectedNote } = useSelectedNote();

  return (
    <>
      <ButtonBarContainer>
        <DateButtonBar>
          <Button
            onClick={controlHeld ? onPreviousNoteDayClick : onPreviousDayClick}
            aria-label="note-list-previous"
          >
            {controlHeld ? (
              <FaRightToBracket className="fa-rotate-180" />
            ) : (
              <FaChevronLeft />
            )}
          </Button>
          <NoteListDate>{currentDate.format("MMM D, YYYY")}</NoteListDate>
          <Button
            onClick={controlHeld ? onNextNoteDayClick : onNextDayClick}
            aria-label="note-list-next"
          >
            {controlHeld ? <FaRightToBracket /> : <FaChevronRight />}
          </Button>
        </DateButtonBar>
        <TodayButton onClick={onTodayClick}>Today</TodayButton>
        <SortButtonBar
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByClick={setSortBy}
          onSortDirectionClick={setSortDirection}
        />
      </ButtonBarContainer>
      <ListContainer>
        {noteSearchTypes.includes(NoteSearchTypes.Related) && (
          <>
            <NoteTypeHeader>Related Notes</NoteTypeHeader>
            <NoteListItems
              notes={relatedNotesData ?? []}
              selectedNoteId={selectedNote?.id}
              sortBy={sortBy}
              sortDirection={sortDirection}
              key={`RelatedNotes:{currentDate.toISOString()}`}
              primaryTextStrategy={(note) =>
                `${moment(note.createdTime).format("LT")}`
              }
            />{" "}
          </>
        )}
        <NoteTypeHeader>Created Notes</NoteTypeHeader>
        <NoteListItems
          notes={createdNotesData ?? []}
          selectedNoteId={selectedNote?.id}
          sortBy={sortBy}
          sortDirection={sortDirection}
          key={`CreatedNotes:{currentDate.toISOString()}`}
          primaryTextStrategy={(note) =>
            `${moment(note.createdTime).format("LT")}`
          }
        />
        {noteSearchTypes.includes(NoteSearchTypes.Modified) && (
          <>
            <NoteTypeHeader>Modified Notes</NoteTypeHeader>
            <NoteListItems
              notes={modifiedNotesData ?? []}
              selectedNoteId={selectedNote?.id}
              sortBy={sortBy}
              sortDirection={sortDirection}
              key={`ModifiedNotes:{currentDate.toISOString()}`}
              primaryTextStrategy={(note) =>
                `${moment(note.updatedTime).format("LT")}`
              }
            />
          </>
        )}
      </ListContainer>
    </>
  );
}

export default NoteList;
