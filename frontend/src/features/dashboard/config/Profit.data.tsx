import { SummaryDataType } from "@features/common/ui/SummaryBar.ui"
import { ST } from "@shared/config/kor.lang"

export const SummaryData = (): SummaryDataType[] => {
  return [
    {id: '1', label: ST.PROFIT.CODES, value: '123456789'},
    {id: '2', label: ST.PROFIT.MONTHS, value: '123456789'},
    {id: '3', label: ST.PROFIT.DAYS, value: '123456789'},
    {id: '4', label: ST.PROFIT.ALL, value: '123456789'},
  ]
}