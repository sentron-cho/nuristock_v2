import { SummaryDataType } from "@features/common/ui/SummaryBar.ui"

export const SummaryData = (): SummaryDataType[] => {
  return [
    {label: '자본', value: '123456789'},
    {label: '시세매도기', value: '123456789'},
    {label: '예상손익', value: '123456789'},
  ]
}