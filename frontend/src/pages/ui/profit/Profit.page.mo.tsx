import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import clsx from 'clsx';
import { ST } from '@shared/config/kor.lang';
import { StyledProfitPage } from '@page/style/Profit.style';
import { ProfitCardField } from '@features/profit/ui/ProfitCardField.ui';
import { URL } from '@shared/config/url.enum';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { styled } from '@styles/stitches.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { Card } from '@entites/Card';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { ProfitItemType } from '@features/profit/api/profit.dto';
import { CardTitleNavi } from '@entites/CardTitleNavi';

const StyledPage = styled(StyledProfitPage, {
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
			<Flex className='view-box' direction={'column'} gap={20} {...handlerSwipe}>
				{/* 연도별 */}
				{viewType === 'year' && (
					<Flex className={clsx(swipeClass)} direction={'column'} justify={'center'}>
						<CardTitleNavi options={naviOptions} value={viewType} onClick={onClick} />

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
						<CardTitleNavi options={naviOptions} value={viewType} onClick={onClick} />

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

// const CardTitleNavi = ({
// 	type,
// 	onClick,
// }: {
// 	type: 'year' | 'code';
// 	onClick?: (eid: 'year' | 'code') => void;
// }) => {
// 	return (
// 		<Flex className={clsx('card-title-navi')} gap={10} justify={'center'}>
// 			<SubTitle
// 				fontSize={'small'}
// 				className={clsx('button', 'left')}
// 				title={type === 'code' ? ST.PER_YEARS : ST.PER_CODES}
// 				onClick={() => onClick?.(type === 'year' ? 'code' : 'year')}
// 			/>
// 			<Title flex={1} align='center' className={clsx('navi')} title={type === 'year' ? ST.PER_YEARS : ST.PER_CODES} />
// 			<SubTitle
// 				fontSize={'small'}
// 				className={clsx('button', 'right')}
// 				title={type === 'code' ? ST.PER_YEARS : ST.PER_CODES}
// 				onClick={() => onClick?.(type === 'year' ? 'code' : 'year')}
// 			/>
// 		</Flex>
// 	);
// };
