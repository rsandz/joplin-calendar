import { weekdaysShort } from "moment";
import React from "react";
import styled from "styled-components";
import useOnSettingsChange from "../hooks/useOnSettingsChange";
import { WEEK_START_DAY, WeekStartDay } from "@constants/Settings";

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

  const weekStartDay = useOnSettingsChange<WeekStartDay>(
    WEEK_START_DAY,
    WeekStartDay.Sunday
  );

  // Need to shift the headers based on the week start day
  if (weekStartDay === WeekStartDay.Monday) {
    calendarHeader.push(calendarHeader.shift());
  }

  return <HeaderRow>{...calendarHeader}</HeaderRow>;
}

export default CalendarHeader;
