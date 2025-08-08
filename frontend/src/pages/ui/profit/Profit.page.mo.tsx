import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SubTitle } from '@entites/Title';
import clsx from 'clsx';
import { ST } from '@shared/config/kor.lang';
import { StyledProfitPage } from '@page/style/Profit.style';
import { ProfitCardField } from '@features/profit/ui/ProfitCardField.ui';
import { URL } from '@shared/config/url.enum';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { styled } from '@styles/stitches.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { unset } from 'lodash';
import { Card } from '@entites/Card';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { ProfitItemType } from '@features/profit/api/profit.dto';

const StyledPage = styled(StyledProfitPage, {
	'.button': {
		color: '$gray500',
		position: 'absolute',
		right: 10,

		'.left': {
			right: unset,
			left: 0,
		},
	},

	'.card': {
		'.box': {
			padding: '20px 10px',
			minHeight: '120px',
		},
	},
});

export const ProfitPageMo = ({ viewType }: { viewType?: 'year' | 'code' }) => {
	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, data, createSumData } = useProfitData(yearsData?.value, profitData?.value, profitData?.dividend);
	const { setActivePage, navigate } = useCommonHook();

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.PROFIT}/${viewType === 'year' ? 'code' : 'year'}`;
		},
	});

	const years = useMemo(() => {
		const items = createSumData(data, 'year');
		return items && sortedByKey(Object.values(items), 'title', true);
	}, [data]);

	const names = useMemo(() => {
		const items = createSumData(data, 'name');
		return items && sortedByKey(Object.values(items), 'sonic', true);
	}, [data]);

	const onClickItemYear = (item: ProfitItemType) => {
		console.log('[onClickItemYear]', { item });
		navigate(`${URL.PROFIT}/year/${item?.title}`)
	};

	const onClickItemName = (item: ProfitItemType) => {
		console.log('[onClickItemName]', { item });
		navigate(`${URL.PROFIT}/code/${item?.title}`)
	};

	return (
		<StyledPage className={clsx('profit', 'main')} summaryData={summary}>
			<Flex className='view-box' direction={'column'} gap={20} {...handlerSwipe}>
				{/* 연도별 */}
				{viewType === 'year' && (
					<Flex className={clsx(swipeClass)} direction={'column'} justify={'center'}>
						<Flex className={clsx('card-sub-title')} gap={10} justify={'center'}>
							<SubTitle flex={1} align='center' className={clsx('year')} title={ST.PER_YEARS} />
							<SubTitle className={clsx('button')} title={ST.PER_CODES} onClick={() => setActivePage(1)} />
						</Flex>

						<Card className={clsx('card')}>
							<Flex className={clsx('box')} direction='column' gap={10}>
								<ProfitCardField className='years' data={years} onClickItem={onClickItemYear} />
							</Flex>
						</Card>
					</Flex>
				)}

				{/* 종목별 */}
				{viewType === 'code' && (
					<Flex className={clsx(swipeClass)} direction={'column'}>
						<Flex className={clsx('card-sub-title')} gap={10} justify={'center'}>
							<SubTitle className={clsx('button', 'left')} title={ST.PER_YEARS} onClick={() => setActivePage(0)} />
							<SubTitle flex={1} align='center' className={clsx('year')} title={ST.PER_CODES} />
						</Flex>

						<Card className={clsx('card')}>
							<Flex className={clsx('box')} direction='column' gap={10}>
								<ProfitCardField className='names' data={names} onClickItem={onClickItemName} />
							</Flex>
						</Card>
					</Flex>
				)}
			</Flex>
		</StyledPage>
	);
};
