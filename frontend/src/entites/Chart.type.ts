export interface ChartDataType {
  name: string; // 종목명 (예: '현대차')
  value: number; // 금액(원) — 실제에선 보유금액
  key?: string; // 종목코드 등 고유키 (선택)
  color?: string; // 지정 색상 (선택)
};

export interface ColoredSlice extends ChartDataType {
  color: string;
  label?: string;
};

export interface ChartLegendProps {
  data: ColoredSlice[]; // 상위에서 색상/percent 계산된 데이터
  valueFormatter?: (v: number) => string;
  onClick?: (s: ColoredSlice) => void;
}