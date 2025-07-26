import { useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryData, Headers } from '@features/profit/config/Profit.data';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { Table, TableRecordType } from '@entites/Table';
import { FILTER_TYPE, useProfitTable } from '@features/profit/ProfitTable.hook';
import { getCostColorType, toCost } from '@shared/libs/utils.lib';
import { ProfitItemType } from '@features/profit/api/profit.dto';
import { SubTableList } from '@features/profit/ui/SubTableList.ui';

const StyledPage = styled(PageContainer, {
	'&.profit': {
		box: {
			paddingBottom: '40px',
		},

		'.table-layer': {
			marginTop: '$10',
		},

		'.card-list': {
			flexWrap: 'wrap',
			gap: '$0',
		},

		'.contents-wrap > div:last-child > div': {
			marginBottom: '$20',
		},
	},
});

const ProfitPage = () => {
	// const [loading, setLoading] = useState<boolean>(false);

	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const {
		loading,
		formMethod,
		data,
		years,
		filteredData: list,
		total,
		filter,
		selectedRows,
		rowClassName,
		setFilter,
		setSelectedRow,
		clearSelectedRow,
	} = useProfitTable(profitData?.value, yearsData?.value);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const headers = useMemo(() => Headers({ filter }), [filter]);

	const onClickSummary = (item?: SummaryDataType) => {
		setFilter(item?.id as FILTER_TYPE);
		clearSelectedRow();
	};

	// const onClickError = () => {
	// 	const error = new Error('인증 오류입니다');
	// 	error.name = ErrorType.Unknown;
	// 	showBoundary(error);
	// };

	// const onClickToast = () => {
	// 	toast('info', '성공');
	// };

	const onClickTitleBar = () => {
		console.log('[onClickTitleBar]');
	};

	const onChangeTitleBar = (value: string) => {
		console.log('[onClickTitleBar]', { value });
	};

	const onRowClick = (record: TableRecordType) => {
		setSelectedRow(record as ProfitItemType);
	};

	return (
		<StyledPage className='profit' summaryData={summaryData} onClickSummary={onClickSummary}>
			<PageTitleBar
				title={total ? `${ST.SONIC} : ${toCost(total)}` : ''}
				titleProps={{ className: getCostColorType(total) }}
				selectProps={{
					options: years,
					id: 'year',
					formMethod: formMethod,
					// defaultValue: yearsSelect?.[0]?.value,
					// onChange: onChangeTitleBar,
				}}
				buttonProps={{
					title: ST.ADD,
					onClick: onClickTitleBar,
				}}
			/>

			<Flex direction={'column'} className={'table-layer'} flex={1}>
				<Table
					rowKey={'rowid'}
					headers={headers}
					data={list}
					loading={loading}
					pending={loading}
					// fixedRowCount={10}
					onRowClick={onRowClick}
					rowClassName={rowClassName}
				/>

				{selectedRows?.length && <SubTableList headers={headers} selected={selectedRows} data={data} filter={filter} />}
			</Flex>
		</StyledPage>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
