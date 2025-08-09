import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import clsx from 'clsx';
import { ST } from '@shared/config/kor.lang';
import { ProfitCardField } from '@features/profit/ui/ProfitCardField.ui';
import { URL } from '@shared/config/url.enum';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { styled } from '@styles/stitches.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Card } from '@entites/Card';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { ProfitItemType } from '@features/profit/api/profit.dto';
import { TitleNavigation } from '@entites/TitleNavigation';
import { PageContainer } from '@features/common/ui/PageContainer.ui';

const StyledPage = styled(PageContainer, {
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
	const { navigate } = useCommonHook();

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
		navigate(`${URL.PROFIT}/year/${item?.title}`);
	};

	const onClickItemName = (item: ProfitItemType) => {
		navigate(`${URL.PROFIT}/code/${item?.title}`);
	};

	const onClick = (eid?: string) => {
		console.log({ eid });
		eid && navigate(`${URL.PROFIT}/${eid}`);
	};

	const naviOptions = useMemo(
		() => [
			{ label: ST.PER_YEARS, value: 'year' },
			{ label: ST.PER_CODES, value: 'code' },
		],
		[]
	);

	return (
		<StyledPage className={clsx('profit', 'main')} summaryData={summary}>
			<Flex className='contents-layer' direction={'column'} gap={20} {...handlerSwipe}>

				{/* 연도별 */}
				{viewType === 'year' && (
					<Flex className={clsx(swipeClass)} direction={'column'} justify={'center'}>
						<TitleNavigation sticky options={naviOptions} value={viewType} onClick={onClick} />

						<Card className={clsx('card')}>
							<Flex className={clsx('box')} direction='column' gap={10}>
								<ProfitCardField rowHeight={32} className='years' data={years} onClickItem={onClickItemYear} />
							</Flex>
						</Card>
					</Flex>
				)}

				{/* 종목별 */}
				{viewType === 'code' && (
					<Flex className={clsx(swipeClass)} direction={'column'}>
						<TitleNavigation sticky options={naviOptions} value={viewType} onClick={onClick} />

						<Card className={clsx('card')}>
							<Flex className={clsx('box')} direction='column' gap={10}>
								<ProfitCardField rowHeight={32} className='names' data={names} onClickItem={onClickItemName} />
							</Flex>
						</Card>
					</Flex>
				)}
			</Flex>
		</StyledPage>
	);
};
