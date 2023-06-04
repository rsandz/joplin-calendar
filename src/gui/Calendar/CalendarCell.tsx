import moment from "moment";
import React, { useCallback } from "react";
import styled, { css } from "styled-components";

const StyledCell = styled.td<{ muted?: boolean; selected?: boolean }>`
  text-align: center;
  background-color: var(--joplin-background-color);
  border-radius: 0.325rem;
  padding: 0.5rem;

  ${(props) =>
    props.muted
      ? css`
          color: var(--joplin-color3);
        `
      : null}

  ${(props) =>
    props.selected
      ? css`
          background-color: var(--joplin-background-color-hover3);
        `
      : null}

  &:hover {
    background-color: var(--joplin-background-color-hover3);
  }
`;

export interface CalendarCellProps {
  date: moment.Moment;
  muted?: boolean;
  selected?: boolean;
  onSelect?: (date: moment.Moment) => void;
}

function CalendarCell({ date, muted, selected, onSelect }: CalendarCellProps) {
  const onClickCallback = useCallback(() => {
    onSelect(date);
  }, [date, onSelect]);

  return (
    <StyledCell muted={muted} selected={selected} onClick={onClickCallback}>
      {date.format("D")}
    </StyledCell>
  );
}

export default CalendarCell;
