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

  let sortIcon: JSX.Element;
  if (sortBy === "time") {
    sortIcon = <FaRegClock />;
  } else if (sortBy === "alphabetical") {
    sortIcon = <FaA />;
  }

  let sortDirectionIcon: JSX.Element;
  if (sortDirection === "ascending") {
    sortDirectionIcon = <FaArrowUpLong />;
  } else {
    sortDirectionIcon = <FaArrowDownLong />;
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
      >
        {sortIcon}
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
      >
        {sortDirectionIcon}
      </SortDirectionButton>
    </ButtonBar>
  );
}

export default SortButtonBar;
