import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryData, Headers } from '@features/profit/config/Profit.data';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
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
import { reverse, sortBy } from 'lodash';
import { FieldValues, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

const StyledPage = styled(PageContainer, {
	'&.profit': {
		'box': {
			paddingBottom: '40px',
		},

		'.card-list': {
			flexWrap: 'wrap',
			gap: '$0',
		},

		'.sub-table-list:last-child': {
			paddingBottom: '$20',
		}
	}

});

const ProfitPage = () => {
	// const [loading, setLoading] = useState<boolean>(false);
	const [selectedList, setSelectedList] = useState<string[]>();

	const forms = useForm<FieldValues>({
		defaultValues: { year: dayjs().format('YYYY') },
	});

	const selectedYear = forms.watch('year');

	useEffect(() => {
		console.log(selectedYear);
	}, [selectedYear]);

	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit(selectedYear);

	const { data, filteredData: list, total, filter, setFilter } = useProfitTable(profitData?.value);

	const yearsSelect = useMemo(() => {
		const items = yearsData?.value?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType);
		return reverse(sortBy(items, 'value'));
	}, [yearsData]);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const headers = useMemo(() => Headers({ filter }), [filter]);

	const onClickSummary = (item?: SummaryDataType) => {
		// setLoading(true);
		setFilter(item?.id as string);
		setSelectedList(undefined);
		// setTimeout(() => {
		// 	setLoading(false);
		// }, 100);
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
				const filtered = selectedList?.filter((name) => name !== row.name);
				setSelectedList(filtered?.length ? filtered : undefined);
			} else {
				setSelectedList((prev) => [...(prev || []), row.name]);
			}
		}
	};

	return (
		<StyledPage className='profit' summaryData={summaryData} onClickSummary={onClickSummary}>
			<PageTitleBar
				title={total ? `${ST.SONIC} : ${toCost(total)}` : ''}
				titleProps={{ className: getCostColorType(total) }}
				selectProps={{
					options: yearsSelect,
					id: 'year',
					formMethod: forms,
					// defaultValue: yearsSelect?.[0]?.value,
					// onChange: onChangeTitleBar,
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
					// loading={loading}
					// pending={loading}
					// fixedRowCount={10}
					onRowClick={onRowClick}
				/>
			</Flex>

			{selectedList?.length && <SubTableList headers={headers} selected={selectedList} data={data} filter={filter} />}
		</StyledPage>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
