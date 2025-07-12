import { SummaryDataType } from "@features/common/ui/SummaryBar.ui"
import { ST } from "@shared/config/kor.lang"

export const SummaryData = (): SummaryDataType[] => {
  return [
    {id: '1', label: ST.DASHBOARD.CAPITAL, value: '123456789'},
    {id: '2', label: ST.DASHBOARD.AT_MARKET_PRICE, value: '123456789'},
    {id: '3', label: ST.DASHBOARD.PROFIT_AND_LOSS, value: '123456789'},
  ]
}