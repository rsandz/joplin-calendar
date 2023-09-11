import React from "react";
import {
  FaRegClock,
  FaA,
  FaArrowUpLong,
  FaArrowDownLong,
} from "react-icons/fa6";
import styled from "styled-components";
import Button from "../StyledComponents/Button";
import ButtonBar from "../StyledComponents/ButtonBar";

export type SortBy = "time" | "alphabetical";
export type SortDirection = "ascending" | "descending";

const SortButton = styled(Button)`
  flex-grow: 0;
  display: flex;
  align-items: center;
  font-size: 0.925rem;
`;

const SortDirectionButton = styled(Button)`
  flex-grow: 0;
  display: flex;
  align-items: center;
  font-size: 0.925rem;
  padding: 0.125rem;
`;

interface SortButtonBarProps {
  sortBy?: "time" | "alphabetical";
  sortDirection?: "ascending" | "descending";
  onSortByClick?: (sortBy: SortBy) => void;
  onSortDirectionClick?: (sortDirection: SortDirection) => void;
}

function SortButtonBar(props: SortButtonBarProps): JSX.Element {
  const sortBy = props.sortBy ?? "time";
  const sortDirection = props.sortDirection ?? "ascending";

  let sortByIcon: JSX.Element;
  let sortByText: string;
  if (sortBy === "time") {
    sortByIcon = <FaRegClock />;
    sortByText = "Time";
  } else if (sortBy === "alphabetical") {
    sortByIcon = <FaA />;
    sortByText = "Alphabetical";
  }

  let sortDirectionIcon: JSX.Element;
  let sortDirectionText: string;
  if (sortDirection === "ascending") {
    sortDirectionIcon = <FaArrowUpLong />;
    sortDirectionText = "Ascending";
  } else {
    sortDirectionIcon = <FaArrowDownLong />;
    sortDirectionText = "Descending";
  }

  return (
    <ButtonBar>
      <SortButton
        aria-label="sort-button"
        onClick={() => {
          if (sortBy === "alphabetical") {
            props.onSortByClick?.("time");
          } else {
            props.onSortByClick?.("alphabetical");
          }
        }}
        title={`Sort by ${sortByText}`}
      >
        {sortByIcon}
      </SortButton>
      <SortDirectionButton
        aria-label="sort-direction-button"
        onClick={() => {
          if (sortDirection === "ascending") {
            props.onSortDirectionClick?.("descending");
          } else {
            props.onSortDirectionClick?.("ascending");
          }
        }}
        title={`Sort ${sortDirectionText}`}
      >
        {sortDirectionIcon}
      </SortDirectionButton>
    </ButtonBar>
  );
}

export default SortButtonBar;
