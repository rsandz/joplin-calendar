import moment from "moment";
import React from "react";
import styled from "styled-components";

const ButtonBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.125;

  button,
  p {
    padding: 0.375rem 0.5rem 0.375rem 0.5rem;
    border: 1px solid darkgray;
    border-radius: 0;
    margin: 0;
  }

  *:not(:last-child) {
    border-right: 0; // No double border
  }

  *:first-child {
    border-radius: 0.325rem 0 0 0.325rem;
  }

  *:last-child {
    border-radius: 0 0.325rem 0.325rem 0;
  }
`;

const CalendarNavButton = styled.button`
  flex-grow: 1;
  cursor: pointer;

  background-color: var(--joplin-background-color3);
  &:hover {
    background-color: var(--joplin-background-color-hover3);
  }
`;

const CalendarDate = styled.p`
  font-size: calc(var(--joplin-font-size) * 1.25);
  flex-grow: 2;
  flex-basis: 50%;
  background-color: var(--joplin-background-color);
`;

export interface CalendarControlsProps {
  shownMonth: moment.Moment;
  onNextMonthClicked: () => void;
  onPreviousMonthClicked: () => void;
}

function CalendarControls({
  shownMonth,
  onNextMonthClicked,
  onPreviousMonthClicked,
}: CalendarControlsProps) {
  return (
    <tr>
      <th colSpan={7}>
        <ButtonBar>
          <CalendarNavButton onClick={onPreviousMonthClicked}>
            &lt;
          </CalendarNavButton>
          <CalendarDate>{shownMonth.format("MMM, YYYY")}</CalendarDate>
          <CalendarNavButton onClick={onNextMonthClicked}>
            &gt;
          </CalendarNavButton>
        </ButtonBar>
      </th>
    </tr>
  );
}

export default CalendarControls;
