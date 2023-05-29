import React from "react";
import styled, { css } from "styled-components";

const StyledCell = styled.td<{ muted?: boolean }>`
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

  &:hover {
    background-color: var(--joplin-background-color-hover3);
  }
`;

export interface CalendarCellProps {
  day: number | string;
  muted?: boolean;
}

function CalendarCell({ day, muted }: CalendarCellProps) {
  return <StyledCell muted={muted}>{day}</StyledCell>;
}

export default CalendarCell;
