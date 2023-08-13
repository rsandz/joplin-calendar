import moment from "moment";
import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import DotBar from "../DotBar/DotBar";

const StyledCell = styled.td<{
  muted?: boolean;
  selected?: boolean;
  currentDay?: boolean;
}>`
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

  ${(props) =>
    props.currentDay
      ? css`
          border: var(--joplin-color-correct) solid 3px;
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
  currentDay?: boolean;
  numberOfDots?: number;
  onSelect?: (date: moment.Moment) => void;
}

function CalendarCell({
  date,
  muted,
  selected,
  currentDay,
  numberOfDots,
  onSelect,
}: CalendarCellProps) {
  const onClickCallback = useCallback(() => {
    onSelect(date);
  }, [date, onSelect]);

  return (
    <StyledCell
      muted={muted}
      selected={selected}
      onClick={onClickCallback}
      currentDay={currentDay}
    >
      {date.format("D")}
      <DotBar numberOfDots={numberOfDots ?? 0} />
    </StyledCell>
  );
}

export default CalendarCell;
