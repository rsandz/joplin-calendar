import styled from "styled-components";

export default styled.button`
  flex-grow: 1;
  cursor: pointer;

  background-color: var(--joplin-background-color3);
  &:hover {
    background-color: var(--joplin-background-color-hover3);
  }

  border: 1px solid darkgray;
  border-radius: 0.325rem;
`;
