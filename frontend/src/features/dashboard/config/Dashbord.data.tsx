import { SummaryDataType } from "@features/common/ui/SummaryBar.ui"
import { ST } from "@shared/config/default.config"

export const SummaryData = (): SummaryDataType[] => {
  return [
    {label: ST.CAPITAL, value: '123456789'},
    {label: ST.AT_MARKET_PRICE, value: '123456789'},
    {label: ST.PROFIT_AND_LOSS, value: '123456789'},
  ]
}