import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';
import { RenderPrice } from '@shared/libs/tableRender.lib';
import { ColumnsType } from 'antd/es/table';

export const BucketlistSummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'valuation', label: ST.INVESTMENT_FINAL, value: values?.[0] || '' },
		{ id: 'sonic', label: ST.INVESTMENT_SONIC, value: values?.[1] || '' },
		{ id: 'invest', label: ST.INVESTMENT_IN, value: values?.[2] || '' },
	];
};

export const Headers = ({ isMobile }: { isMobile?: boolean }): ColumnsType => {
	const TITLE = ST.BUCKET_TABLE;

	const items: ColumnsType = [
		{
			title: TITLE.YEAR,
			dataIndex: 'year',
			key: 'year',
			align: 'left',
			fixed: true,
			width: 60,
		},
		{
			title: TITLE.START,
			dataIndex: 'start',
			key: 'start',
			align: 'right',
			render: (v) => RenderPrice(Math.ceil(v)),
		},
		{
			title: TITLE.AFTER_GROWTH,
			dataIndex: 'afterGrowth',
			key: 'afterGrowth',
			align: 'right',
			render: (v) => RenderPrice(Math.ceil(v)),
			hidden: isMobile,
		},
		{
			title: TITLE.CONTRIBUTION,
			dataIndex: 'contribution',
			key: 'contribution',
			align: 'right',
			render: (v) => RenderPrice(Math.ceil(v)),
			hidden: isMobile,
		},
		{
			title: TITLE.TOTAL,
			dataIndex: 'end',
			key: 'end',
			align: 'right',
			render: (v) => RenderPrice(Math.ceil(v)),
		},
		{
			title: TITLE.NOT_ADDED,
			dataIndex: 'end_noContrib',
			key: 'end_noContrib',
			align: 'right',
			render: (v) => RenderPrice(Math.ceil(v)),
			hidden: isMobile,
		},
		{
			title: TITLE.INTEREST,
			dataIndex: 'interestEarned',
			key: 'interestEarned',
			align: 'right',
			render: (v) => RenderPrice(Math.ceil(v)),
			hidden: isMobile,
		},
	];

	return items;
};
