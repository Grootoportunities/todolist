import styled from "styled-components";

const TasksList = styled.ul`
  list-style: none;
  padding-left: 0;
`;
const NoTasks = styled.h3`
  text-align: center;
  margin-top: 40px;
  opacity: 0.5;
`;

export const S = { TasksList, NoTasks };
