import moment from "moment";
import React from "react";
import styled from "styled-components";
import ButtonBar from "../StyledComponents/ButtonBar";
import Button from "../StyledComponents/Button";
import PlainText from "../StyledComponents/PlainText";
import useControlHeld from "../hooks/useControlHeld";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
} from "react-icons/fa6";

const CalendarDate = styled(PlainText)`
  flex-grow: 2;
  flex-basis: 50%;
`;

export interface CalendarControlsProps {
  shownMonth: moment.Moment;
  onNextMonthClicked: () => void;
  onNextYearClicked: () => void;
  onPreviousMonthClicked: () => void;
  onPreviousYearClicked: () => void;
}

function CalendarControls({
  shownMonth,
  onNextMonthClicked,
  onNextYearClicked,
  onPreviousMonthClicked,
  onPreviousYearClicked,
}: CalendarControlsProps) {
  const controlHeld = useControlHeld();
  return (
    <tr>
      <th colSpan={7}>
        <ButtonBar>
          <Button
            onClick={
              controlHeld ? onPreviousYearClicked : onPreviousMonthClicked
            }
            aria-label="calendar-previous"
          >
            {controlHeld ? <FaAnglesLeft /> : <FaAngleLeft />}
          </Button>
          <CalendarDate>{shownMonth.format("MMM YYYY")}</CalendarDate>
          <Button
            onClick={controlHeld ? onNextYearClicked : onNextMonthClicked}
            aria-label="calendar-next"
          >
            {controlHeld ? <FaAnglesRight /> : <FaAngleRight />}
          </Button>
        </ButtonBar>
      </th>
    </tr>
  );
}

export default CalendarControls;
