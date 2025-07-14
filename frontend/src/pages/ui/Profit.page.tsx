import { useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryData, Headers } from '@features/profit/config/Profit.data';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
// import { useErrorBoundary } from 'react-error-boundary';
// import { ErrorType } from '@layouts/ui/ErrorBoundary';
// import { useToast } from '@layouts/hooks/toast.hook';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import { SelectOptionType } from '@entites/SelectForm';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { Table, TableRecordType } from '@entites/Table';
import { useProfitTable } from '@features/profit/ProfitTable.hook';
import { getCostColorType, toCost } from '@shared/libs/utils.lib';
import { ProfitItemType } from '@features/profit/api/profit.dto';
import { SubTableList } from '@features/profit/ui/SubTableList.ui';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const ProfitPage = () => {
	// const { showBoundary } = useErrorBoundary();
	// const { toast } = useToast();

	const { data: profitData } = useSelectProfit();
	const { data: yearsData } = useSelectProfitYears();
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedList, setSelectedList] = useState<string[]>();

	// const list = useMemo(() => data?.value, [data]);

	// const years = useEffect(() => yearsData?.value, [yearsData]);

	const { data, filteredData: list, total, filter, setFilter } = useProfitTable(profitData?.value);

	const yearsSelect = useMemo(
		() => yearsData?.value?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType),
		[yearsData]
	);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const headers = useMemo(() => Headers({ filter }), [filter]);
	console.log({ list, yearsSelect, headers, profitData });

	const onClickSummary = (item?: SummaryDataType) => {
		setLoading(true);
		setFilter(item?.id as string);
		setSelectedList(undefined);
		setTimeout(() => {
			setLoading(false);
		}, 100);
		console.log('[onClickSummary]', { item });
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
		const row = record as ProfitItemType;
		if (row?.name) {
			if (selectedList?.includes(row.name)) {
				setSelectedList((prev) => prev?.filter((name) => name !== row.name));
			} else {
				setSelectedList((prev) => [...(prev || []), row.name]);
			}
		}
	};

	return (
		<StyledPage summaryData={summaryData} onClickSummary={onClickSummary}>
			<PageTitleBar
				title={total ? `${ST.SONIC} : ${toCost(total)}` : ''}
				titleProps={{ className: getCostColorType(total) }}
				selectProps={{
					options: yearsSelect,
					defaultValue: yearsSelect?.[0]?.value,
					onChange: onChangeTitleBar,
				}}
				buttonProps={{
					title: ST.ADD,
					onClick: onClickTitleBar,
				}}
			/>

			<Flex className={'table-layer'}>
				<Table
					rowKey={'rowid'}
					headers={headers}
					data={list}
					loading={loading}
					pending={loading}
					// fixedRowCount={10}
					onRowClick={onRowClick}
				/>
			</Flex>

			{selectedList?.length && <SubTableList
				headers={headers}
				selected={selectedList}
				data={data}
				filter={filter}
			/>}
		</StyledPage>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
