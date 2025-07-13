import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';
import { RenderCost, RenderDate, RenderPrice } from '@shared/libs/tableRender.lib';
import { getCostColorType } from '@shared/libs/utils.lib';
import { ColumnsType } from 'antd/es/table';

export const SummaryData = (): SummaryDataType[] => {
	return [
		{ id: 'codes', label: ST.PER_CODES, value: '123456789' },
		{ id: 'months', label: ST.PER_MONTHS, value: '123456789' },
		{ id: 'days', label: ST.PER_DAYS, value: '123456789' },
		{ id: 'all', label: ST.ALL, value: '123456789' },
	];
};

export const Headers = ({ filter }: { filter?: string }): ColumnsType => {
	const TITLE = ST.PROFIT_TABLE;

	const hidden = filter === 'months' || filter === 'days';
	const title = hidden ? TITLE.YEAR : TITLE.NAME;

	const items: ColumnsType = [
		{ title: title, dataIndex: 'name', key: '', align: 'left' },
		{ title: TITLE.CODE, dataIndex: 'code', key: '', align: 'center', hidden: hidden },
		{ title: TITLE.SDATE, dataIndex: 'sdate', key: '', align: 'center', hidden: hidden, render: RenderDate },
		{ title: TITLE.EDATE, dataIndex: 'edate', key: '', align: 'center', hidden: hidden, render: RenderDate },
		{
			title: TITLE.SPRICE,
			dataIndex: 'scost',
			key: 'scost',
			align: 'right',
			render: (v, row) => {
				const color = getCostColorType(row?.sonic);
				return RenderPrice(v, { color });
			},
		},
		{
			title: TITLE.EPRICE,
			dataIndex: 'ecost',
			key: 'scost',
			align: 'right',
			render: (v, row) => {
				const color = getCostColorType(row?.sonic);
				return RenderPrice(v, { color });
			},
		},
		{
			title: TITLE.SONICRATE,
			dataIndex: 'sonic_rate',
			key: 'sonic_rate',
			align: 'right',
			render: (v, row) => {
				// const sonic = row?.ecost - row?.scost;
				const cost = Math.round((row?.sonic / row?.scost) * 100);
				const color = getCostColorType(cost);

				return RenderCost(!isNaN(cost) ? cost?.toFixed(1) : v, { color });
			},
		},
		{
			title: TITLE.YSONICRATE,
			dataIndex: 'sonic_rate_year',
			key: 'sonic_rate_year',
			align: 'right',
			render: (v, row) => {
				// const sonic = row?.ecost - row?.scost;
				const cost = Math.round((row?.sonic / row?.scost) * 100);
				const color = getCostColorType(cost);

				return RenderCost(!isNaN(cost) ? cost?.toFixed(1) : v, { color });
			},
		},
		{
			title: TITLE.SONIC,
			dataIndex: 'sonic',
			key: 'sonic',
			align: 'right',
			render: (v) => {
				const color = getCostColorType(v);
				return RenderPrice(v, { color });
			},
		},
	];

	return items;
};
