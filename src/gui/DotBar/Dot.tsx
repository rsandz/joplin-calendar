import styled, { css } from "styled-components";

/**
 * Props for the {@link Dot} component.
 *
 * @property size The size of the dot in rem.
 */
export interface DotProps {
  size?: number;
  color?: string;
}

const Dot = styled.span<DotProps>`
  display: inline-block;
  border-radius: 50%;

  height: ${(props) => props.size ?? 0.4}rem;
  width: ${(props) => props.size ?? 0.4}rem;

  background-color: ${(props) => props.color ?? "var(--joplin-color3)"};
`;

export default Dot;
