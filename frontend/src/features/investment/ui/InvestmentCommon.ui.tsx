import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { ST } from '@shared/config/kor.lang';
import clsx from 'clsx';
import { InvestmentItemType } from '../api/investment.dto';
import { styled } from '@styles/stitches.config';
import { useInvestmentPerValueHook } from '../hook/Investment.hook';
import { toCost, toShortCost, valueOfPlusMinus, withCommas } from '@shared/libs/utils.lib';
import { useMemo } from 'react';
import { calcExcessProfit, calcShareholderValue } from '@shared/libs/investment.util';

const StyledFlex = styled(Flex, {
	'&.info-field': {
		'.title': {
			backgroundColor: '$lightgreen',
			padding: 8,
		},

		'.list-box': {
			padding: 8,
			background: '$gray200',
		},

		'.list-th': {
			borderBottom: '1px solid $gray600',
		},

		'.up': {
			color: '$plus',
		},

		'.down': {
			color: '$minus',
		},
	},
});

export const InvestmentInfoField = ({ data }: { data?: InvestmentItemType }) => {
	const parsed = useMemo(() => {
		const shareValue = toShortCost(calcShareholderValue({ ...data }));

		return {
			equity: toShortCost(data?.equity),
			profit: toShortCost(calcExcessProfit({ ...data })),
			shareValue: shareValue,
		};
	}, [data]);

	return (
		<StyledFlex className={clsx('info-field')} direction={'column'} gap={8}>
			{/* 상장 주식수 */}
			<Flex className='title' justify={'between'} align={'center'} height={24}>
				<Flex fullWidth={false} gap={4} flex={3}>
					<Text size='xs' text={`${ST.STOCKS_COUNT}:`} />
					<Text bold size='xs' text={`${withCommas(data?.count)}`} />
				</Flex>
				<Flex fullWidth={false} flex={1} justify={'center'}>
					<Text bold size='xs' className={valueOfPlusMinus(Number(data?.shareRate), 1)} text={`W${data?.shareRate}`} />
				</Flex>
				<Flex fullWidth={false} gap={4} flex={2} justify={'end'}>
					<Text size='xs' text={`ROE:`} />
					<Text bold size='xs' className={valueOfPlusMinus(Number(data?.roe))} text={` ${data?.roe}%`} />
				</Flex>
			</Flex>

			<Flex className='list-box' direction={'column'} gap={4}>
				<Flex className='list-th' height={20}>
					<Text size='xs' text={'EPS'} flex={1} align='center' />
					<Text size='xs' text={ST.EXCESS_PROFIT} flex={1} align='center' />
					<Text size='xs' text={ST.SHARE_VALUE} flex={1} align='center' />
					<Text size='xs' text={ST.CAPITAL} flex={1} align='center' />
					<Text size='xs' text={ST.BASE_RATE} flex={1} align='center' />
				</Flex>

				<Flex className='list-row'>
					{/* EPS */}
					<Text
						bold
						size='xs'
						className={clsx(valueOfPlusMinus(Number(data?.eps)))}
						text={toCost(Number(data?.eps).toFixed(0))}
						flex={1}
						align='center'
					/>
					{/* 초과이익 */}
					<Text
						bold
						size='xs'
						className={clsx(valueOfPlusMinus(Number(parsed?.profit?.value)))}
						text={`${parsed?.profit.value}${parsed?.profit?.unit.replace(ST.WON, '')}`}
						flex={1}
						align='center'
					/>
					{/* 주주가치 */}
					<Text
						bold
						size='xs'
						className={clsx(valueOfPlusMinus(Number(parsed?.shareValue?.value)))}
						text={`${parsed?.shareValue.value}${parsed?.shareValue?.unit.replace(ST.WON, '')}`}
						flex={1}
						align='center'
					/>
					{/* 자본 */}
					<Text
						bold
						size='xs'
						text={`${parsed?.equity.value}${parsed?.equity?.unit.replace(ST.WON, '')}`}
						flex={1}
						align='center'
					/>
					{/* 기준평가율 */}
					<Text bold size='xs' text={withCommas(data?.brate)} flex={1} align='center' />
				</Flex>
			</Flex>
		</StyledFlex>
	);
};

const StyledPerValueField = styled(Flex, {
	'&.per-value': {
		'.list-box': {
			padding: 8,
			background: '$gray200',
		},

		'.title': {
			marginTop: 10,
		},

		'.labels': {
			borderBottom: '1px solid $gray600',
		},

		'.up': {
			color: '$plus',
		},

		'.down': {
			color: '$minus',
		},
	},
});

export const PerValueField = ({ data }: { data?: InvestmentItemType }) => {
	const { list } = useInvestmentPerValueHook(data);

	return (
		<StyledPerValueField className='per-value' direction={'column'} gap={4}>
			{/* <Flex className='title' justify={'center'} align={'center'}>
				<Text bold text={ST.PER_VALUE} />
			</Flex> */}

			<Flex className='list-box' direction={'column'} gap={4}>
				<Flex className={'labels'} height={20}>
					{list?.map((item, index) => {
						return <Text key={`lb-${index}`} flex={1} size='sm' text={`${item?.rate}`} align='center' />;
					})}
				</Flex>

				<Flex className={'values'}>
					{list?.map((item, index) => {
						return (
							<Text
								key={`txt-${index}`}
								className={clsx(item?.updown)}
								flex={1}
								bold
								size='sm'
								text={`${item.value}${ST.WON}`}
								align='center'
							/>
						);
					})}
				</Flex>
			</Flex>
		</StyledPerValueField>
	);
};

const StyledChip = styled('span', {
	'&.chip': {
		border: '1px solid $gray700',
		borderRadius: 100,
		backgroundColor: '$gray',
		width: '20px',
		height: '20px',
		textAlign: 'center',
		lineHeight: '18px',
		fontSize: '$xs',
		fontWeight: 700,
		// position: 'absolute',
		// top: -10,
		// left: -6,

		'&.fnguide': {
			backgroundColor: '$primary',
			borderColor: '$primaryhover',
			color: '$white',
		},

		'&.manual': {
			backgroundColor: '$gray700',
			borderColor: '$gray600',
			color: '$white',
		},
	},
});

export const InvestmentChip = ({ data }: { data?: InvestmentItemType }) => {
	return <StyledChip className={clsx('chip', data?.ctype)}>{data?.ctype?.substring(0, 1).toUpperCase()}</StyledChip>;
};
