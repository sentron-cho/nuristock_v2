// src/pages/CalendarCell.tsx
import { styled } from "@styles/stitches.config";
import dayjs from "dayjs";

const Cell = styled("div", {
  padding: "8px",
  borderRadius: "6px",
  textAlign: "center",
  cursor: "pointer",
  fontSize: 14,
  variants: {
    isCurrentMonth: {
      true: { opacity: 1 },
      false: { opacity: 0.4 },
    },
    selected: {
      true: { backgroundColor: "#1976d2", color: "white" },
      false: {},
    },
  },
});

const Mark = styled("div", {
  fontSize: 10,
  lineHeight: 1.2,
});

type Props = {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  selected?: boolean;
  data?: { buy?: boolean; sell?: boolean };
  onClick: () => void;
};

export const CalendarCell = ({ date, data, onClick, isCurrentMonth, selected }: Props) => {
  return (
    <Cell
      isCurrentMonth={isCurrentMonth}
      selected={selected}
      onClick={onClick}
    >
      {date.date()}
      <div>
        {data?.buy && <Mark>매수 ↑</Mark>}
        {data?.sell && <Mark>매도 ↓</Mark>}
      </div>
    </Cell>
  );
};