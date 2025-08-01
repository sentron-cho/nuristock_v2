import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';
import { RenderCost, RenderDate, RenderPrice } from '@shared/libs/tableRender.lib';
import { getCostColorType, sortDirections } from '@shared/libs/utils.lib';
import { ColumnsType } from 'antd/es/table';

export const SummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'up', label: ST.SONIC_UP, value: values?.[0] },
		{ id: 'down', label: ST.SONIC_DN, value: values?.[1] },
		{ id: 'sum', label: ST.SUM, value: values?.[2] },
	];
};

export const Headers = ({ filter }: { filter?: string }): ColumnsType => {
	const TITLE = ST.PROFIT_TABLE;

	const hidden = filter === 'months' || filter === 'days';
	const title = hidden ? TITLE.YEAR : TITLE.NAME;

	const items: ColumnsType = [
		{
			title: title,
			dataIndex: 'title',
			key: 'title',
			align: 'left',
			defaultSortOrder: 'ascend',
			sortDirections: sortDirections('asc'),
			sorter: (a, b) => String(a.name).localeCompare(b.name),
			fixed: true,
		},
		{
			title: TITLE.CODE,
			dataIndex: 'code',
			key: 'code',
			align: 'center',
			hidden: hidden,
		},
		{
			title: TITLE.SDATE,
			dataIndex: 'sdate',
			key: 'sdate',
			align: 'center',
			hidden: hidden,
			render: RenderDate,
			sorter: (a, b) => String(a.sdate).localeCompare(b.sdate),
		},
		{
			title: TITLE.EDATE,
			dataIndex: 'edate',
			key: 'edate',
			align: 'center',
			hidden: hidden,
			render: RenderDate,
			sorter: (a, b) => String(a.edate).localeCompare(b.edate),
		},
		{
			title: TITLE.SPRICE,
			dataIndex: 'sprice',
			key: 'sprice',
			align: 'right',
			render: (v, row) => {
				const color = getCostColorType(row?.sonic);
				return RenderPrice(v, { color });
			},
		},
		{
			title: TITLE.EPRICE,
			dataIndex: 'eprice',
			key: 'eprice',
			align: 'right',
			render: (v, row) => {
				const color = getCostColorType(row?.sonic);
				return RenderPrice(v, { color });
			},
		},
		{
			title: TITLE.SONICRATE,
			dataIndex: 'sonicRate',
			key: 'sonicRate',
			align: 'right',
			render: (v, row) => {
				const cost = Math.round((row?.sonic / row?.sprice) * 100);
				const color = getCostColorType(cost);
				const value = !isNaN(cost) ? cost?.toFixed(1) : v;
				return RenderCost(value, { color });
			},
			sortDirections: sortDirections('desc'),
			sorter: (a, b) => Math.round((a?.sonic / a?.scost) * 100) - Math.round((b?.sonic / b?.scost) * 100),
		},
		{
			title: TITLE.YSONICRATE,
			dataIndex: 'sonicRateYear',
			key: 'sonicRateYear',
			align: 'right',
			render: (v, row) => {
				const cost = Math.round((row?.sonic / row?.sprice) * 100);
				const color = getCostColorType(cost);
				const value = !isNaN(cost) ? cost?.toFixed(1) : v;
				return RenderCost(value, { color });
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
			sortDirections: sortDirections('desc'),
			sorter: (a, b) => a.sonic - b.sonic,
		},
	];

	return items;
};
