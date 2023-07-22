import styled from "styled-components";

export default styled.div`
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
