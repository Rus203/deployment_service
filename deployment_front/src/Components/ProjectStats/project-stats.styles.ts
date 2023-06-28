import styled from "styled-components";

export const Container = styled.div``;

export const StatHeader = styled.h2`
  margin: 0;
  padding: 0;
  margin-top: 20px;
`;

export const ColoredSpan = styled.span<ColoredSpanProps>`
  color: ${(props) => props.color};
`;

interface ColoredSpanProps {
  color: string;
}
