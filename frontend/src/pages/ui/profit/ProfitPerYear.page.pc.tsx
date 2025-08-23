import { useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { styled } from '@styles/stitches.config';
import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import { FILTER_TYPE, useProfitTable } from '@features/profit/hook/ProfitTable.hook';
import { ProfitView } from '@features/profit/ui/ProfitView.ui';

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

export const ProfitPerYearPagePc = () => {
	// const [loading, setLoading] = useState<boolean>(false);

	const [filter, setFilter] = useState<FILTER_TYPE>('codes');

	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summaryData } = useProfitTable(profitData?.value, yearsData?.value);

	const onClickSummary = (item?: SummaryDataType) => {
		setFilter(item?.id as FILTER_TYPE);
		// clearSelectedRow();
	};

	// const onClickError = () => {
	// 	const error = new Error('인증 오류입니다');
	// 	error.name = ErrorType.Unknown;
	// 	showBoundary(error);
	// };

	// const onClickToast = () => {
	// 	toast('info', '성공');
	// };

	return (
		<StyledPage className='profit' summaryData={summaryData} onClickSummary={onClickSummary}>
			<ProfitView
				active={filter === 'codes'}
				viewType={'codes'}
				profitData={profitData?.value}
				yearsData={yearsData?.value}
			/>

			<ProfitView
				active={filter === 'months'}
				viewType={'months'}
				profitData={profitData?.value}
				yearsData={yearsData?.value}
			/>
			<ProfitView
				active={filter === 'days'}
				viewType={'days'}
				profitData={profitData?.value}
				yearsData={yearsData?.value}
			/>
			<ProfitView
				active={filter === 'all'}
				viewType={'all'}
				profitData={profitData?.value}
				yearsData={yearsData?.value}
			/>
		</StyledPage>
	);
};
