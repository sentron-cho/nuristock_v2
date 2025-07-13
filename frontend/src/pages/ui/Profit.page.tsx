import { useMemo } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryData, Headers } from '@features/dashboard/config/Profit.data';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { Button } from '@entites/Button';
import { useErrorBoundary } from 'react-error-boundary';
import { ErrorType } from '@layouts/ui/ErrorBoundary';
import { useToast } from '@layouts/hooks/toast.hook';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import { SelectOptionType } from '@entites/SelectForm';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import Flex from '@entites/Flex';
import { Table } from '@entites/Table';
import { useProfitTable } from '@features/profit/ProfitTable.hook';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const ProfitPage = () => {
	const { showBoundary } = useErrorBoundary();
	const { toast } = useToast();

	const { data: profitData } = useSelectProfit();
	const { data: yearsData } = useSelectProfitYears();

	// const list = useMemo(() => data?.value, [data]);

	// const years = useEffect(() => yearsData?.value, [yearsData]);

	const { filteredData: list, filter, setFilter } = useProfitTable(profitData?.value);

	const yearsSelect = useMemo(
		() => yearsData?.value?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType),
		[yearsData]
	);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const headers = useMemo(() => Headers({filter}), [filter]);
	console.log({ list, yearsSelect, headers, profitData });

	const onClickSummary = (item?: SummaryDataType) => {
		setFilter(item?.id as string);
		console.log('[onClickSummary]', { item });
	};

	const onClickError = () => {
		const error = new Error('인증 오류입니다');
		error.name = ErrorType.Unknown;
		showBoundary(error);
	};

	const onClickToast = () => {
		toast('info', '성공');
	};

	const onClickTitleBar = () => {
		console.log('[onClickTitleBar]');
	};

	const onChangeTitleBar = (value: string) => {
		console.log('[onClickTitleBar]', { value });
	};

	return (
		<StyledPage summaryData={summaryData} onClickSummary={onClickSummary}>
			<PageTitleBar
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
				<Table headers={headers} data={list} />
			</Flex>

			<Button onClick={onClickError} title='오류 테스트'></Button>
			<Button onClick={onClickToast} title='알림 표시'></Button>
		</StyledPage>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
