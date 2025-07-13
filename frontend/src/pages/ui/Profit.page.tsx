import { useMemo } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryData } from '@features/dashboard/config/Profit.data';
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

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const ProfitPage = () => {
	const { showBoundary } = useErrorBoundary();
	const { toast } = useToast();

	const { data } = useSelectProfit();
	const { data: yearsData } = useSelectProfitYears();

	const list = useMemo(() => data?.value, [data]);
	const years = useMemo(() => yearsData?.value, [data]);
	console.log({ list, years });

	const yearsSelect = useMemo(
		() => years?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType),
		[years]
	);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const onClickSummary = (item?: SummaryDataType) => {
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

			<Button onClick={onClickError} title='오류 테스트'></Button>
			<Button onClick={onClickToast} title='알림 표시'></Button>
		</StyledPage>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
