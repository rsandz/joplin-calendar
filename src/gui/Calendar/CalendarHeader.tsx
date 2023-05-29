import { weekdaysShort } from "moment";
import React from "react";
import styled from "styled-components";

const HeaderCell = styled.th`
  font-size: var(--joplin-font-size);
  padding: 0.325rem;
`;

const HeaderRow = styled.tr`
  th {
    border-bottom: 1px gray solid;
  }
`;

export interface CalendarHeaderProps {}

function CalendarHeader(props: CalendarHeaderProps) {
  const calendarHeader = weekdaysShort().map((day) => (
    <HeaderCell>{day}</HeaderCell>
  ));
  return <HeaderRow>{...calendarHeader}</HeaderRow>;
}

export default CalendarHeader;
