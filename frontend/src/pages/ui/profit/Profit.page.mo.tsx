import { useSelectProfit, useSelectProfitYears } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SubTitle } from '@entites/Title';
import clsx from 'clsx';
import { ST } from '@shared/config/kor.lang';
import { StyledProfitPage } from '@page/style/Profit.style';
import { ProfitCardField } from '@features/profit/ui/ProfitCardField.ui';
import { useNavigate } from 'react-router-dom';
import { URL } from '@shared/config/url.enum';
import { useMemo } from 'react';
import { sortedByKey } from '@shared/libs/sort.lib';
import { styled } from '@styles/stitches.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { unset } from 'lodash';
import { SlideWrapper } from '@entites/SliderWrapper';
import { Card } from '@entites/Card';

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

			'.body': {
				gap: '20px',

				'.row': {
					p: {
						'&.title': {
							fontSize: '16px',
						},
					},
				},
			},
		},
	},
});

export const ProfitPageMo = () => {
	const navigate = useNavigate();
	const { data: yearsData } = useSelectProfitYears();
	const { data: profitData } = useSelectProfit();

	const { summary, data, createSumData } = useProfitData(profitData?.value, yearsData?.value);
	const { activePage, setActivePage } = useCommonHook();

	const onClick = (eid: string) => {
		navigate(`${URL.PROFIT}/${eid}`);
	};

	const years = useMemo(() => {
		const items = createSumData(data, 'year');
		return items && sortedByKey(Object.values(items), 'title', true);
	}, [data]);

	const names = useMemo(() => {
		const items = createSumData(data, 'name');
		return items && sortedByKey(Object.values(items), 'sonic', true);
	}, [data]);

	return (
		<StyledPage className={clsx('profit', 'main')} summaryData={summary}>
			<Flex className='view-box' direction={'column'} gap={20}>
				<SlideWrapper active={activePage}>
					<>
						{/* 연도별 */}
						<Flex direction={'column'} justify={'center'}>
							<Flex className={clsx('card-sub-title')} gap={10} justify={'center'}>
								<SubTitle flex={1} align='center' className={clsx('year')} title={ST.PER_YEARS} />
								<SubTitle className={clsx('button')} title={ST.PER_CODES} onClick={() => setActivePage(1)} />
							</Flex>

							<Card className={clsx('card')} onClick={() => onClick('year')}>
								<Flex className={clsx('box')} direction='column' gap={10} >
									<ProfitCardField className='years' data={years} />
								</Flex>
							</Card>
						</Flex>

						{/* 종목별 */}
						<Flex direction={'column'}>
							<Flex className={clsx('card-sub-title')} gap={10} justify={'center'}>
								<SubTitle className={clsx('button', 'left')} title={ST.PER_YEARS} onClick={() => setActivePage(0)} />
								<SubTitle flex={1} align='center' className={clsx('year')} title={ST.PER_CODES} />
							</Flex>

							<Card className={clsx('card')} onClick={() => onClick('code')}>
								<Flex className={clsx('box')} direction='column' gap={10}>
									<ProfitCardField className='names' data={names} />
								</Flex>
							</Card>
						</Flex>
					</>
				</SlideWrapper>
			</Flex>
		</StyledPage>
	);
};
