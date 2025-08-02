import { useState } from "react";
import { styled } from "@styles/stitches.config";
import { CalendarCell } from "./CalendarCell.ui";
import dayjs from "dayjs";
import { FieldValues } from "react-hook-form";

const CalendarGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "4px",
  paddingTop: 8,
});

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const mockData = {
  "2025-08-02": { buy: true, sell: true },
  "2025-08-07": { buy: true },
  "2025-08-19": { buy: true, sell: true },
} as FieldValues;

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = dayjs("2025-08-01");
  const start = today.startOf("month").startOf("week");
  const end = today.endOf("month").endOf("week");
  const dates: dayjs.Dayjs[] = [];

  for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, "day")) {
    dates.push(d);
  }

  return (
    <div>
      <h3 style={{ padding: "8px 0" }}>2025년 8월</h3>
      <CalendarGrid>
        {weekDays.map((d) => (
          <strong key={d}>{d}</strong>
        ))}
        {dates.map((date) => (
          <CalendarCell
            key={date.format("YYYY-MM-DD")}
            date={date}
            isCurrentMonth={date.month() === today.month()}
            selected={selectedDate === date.format("YYYY-MM-DD")}
            data={mockData[date.format("YYYY-MM-DD")]} // 매수/매도 정보
            onClick={() => setSelectedDate(date.format("YYYY-MM-DD"))}
          />
        ))}
      </CalendarGrid>
    </div>
  );
};