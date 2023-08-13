import React from "react";
import Dot from "./Dot";
import styled from "styled-components";
import { range } from "lodash";

export interface DotBarProps {
  numberOfDots: number;
}

const DotContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.125rem;
`;

function DotBar(props: DotBarProps) {
  const dotElements = range(0, props.numberOfDots).map((i) => <Dot key={i} />);

  return <DotContainer>{dotElements}</DotContainer>;
}

export default DotBar;
