import styled, { css } from "styled-components";
import { TaskStatuses } from "../../../../../common/enums";

const TaskItem = styled.li<{ isDone: TaskStatuses }>`
  position: relative;
  padding-left: 10px; /* Отступ для пользовательского маркера */
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-break: break-all;

  ${(props) =>
    props.isDone === TaskStatuses.Completed &&
    css<{ isDone: TaskStatuses }>`
      opacity: 0.5;
    `}
  &::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: black;
    font-size: 1.5em;
  }
`;

export const S = { TaskItem };
