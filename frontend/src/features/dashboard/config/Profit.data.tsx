import { SummaryDataType } from "@features/common/ui/SummaryBar.ui"
import { ST } from "@shared/config/kor.lang"

export const SummaryData = (): SummaryDataType[] => {
  return [
    {id: '1', label: ST.PER_CODES, value: '123456789'},
    {id: '2', label: ST.PER_MONTHS, value: '123456789'},
    {id: '3', label: ST.PER_DAYS, value: '123456789'},
    {id: '4', label: ST.ALL, value: '123456789'},
  ]
}