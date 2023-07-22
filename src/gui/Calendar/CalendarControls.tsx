import moment from "moment";
import React from "react";
import styled from "styled-components";
import ButtonBar from "../StyledComponents/ButtonBar";
import Button from "../StyledComponents/Button";
import PlainText from "../StyledComponents/PlainText";

const CalendarDate = styled(PlainText)`
  flex-grow: 2;
  flex-basis: 50%;
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
          <Button onClick={onPreviousMonthClicked}>&lt;</Button>
          <CalendarDate>{shownMonth.format("MMM, YYYY")}</CalendarDate>
          <Button onClick={onNextMonthClicked}>&gt;</Button>
        </ButtonBar>
      </th>
    </tr>
  );
}

export default CalendarControls;
