import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { ST } from '@shared/config/kor.lang';
import clsx from 'clsx';
import { InvestmentItemType } from '../api/investment.dto';
import { styled } from '@styles/stitches.config';
import { useInvestmentPerValueHook } from '../hook/Investment.hook';
import { toShortCost, valueOfPlusMinus, withCommas } from '@shared/libs/utils.lib';
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
		return {
			equity: toShortCost(data?.equity),
			profit: toShortCost(calcExcessProfit({ ...data })),
			shareValue: toShortCost(calcShareholderValue({ ...data })),
		};
	}, [data]);

	return (
		<StyledFlex className={clsx('info-field')} direction={'column'} gap={8}>
			{/* 상장 주식수 */}
			<Flex className='title' justify={'between'} align={'center'} height={24}>
				<Flex fullWidth={false} gap={4}>
					<Text size='sm' text={`${ST.STOCKS_COUNT}:`} />
					<Text bold size='sm' text={`${withCommas(data?.count)}${ST.JU}`} />
				</Flex>
				<Flex fullWidth={false} gap={4}>
					<Text size='sm' text={`${ST.ROE}:`} />
					<Text bold size='sm' className={valueOfPlusMinus(Number(data?.roe))} text={` ${data?.roe}%`} />
				</Flex>
			</Flex>

			<Flex className='list-box' direction={'column'} gap={4}>
				<Flex className='list-th' height={20}>
					<Text size='sm' text={ST.SHARE_VALUE} flex={1} align='center' />
					<Text size='sm' text={ST.CAPITAL} flex={1} align='center' />
					<Text size='sm' text={'ROE'} flex={1} align='center' />
					<Text size='sm' text={ST.BASE_RATE} flex={1} align='center' />
					<Text size='sm' text={ST.EXCESS_PROFIT} flex={1} align='center' />
				</Flex>

				<Flex className='list-row'>
					<Text bold size='sm' text={parsed?.shareValue?.value} flex={1} align='center' />
					<Text bold size='sm' text={parsed?.equity?.value} flex={1} align='center' />
					<Text bold size='sm' text={data?.roe} flex={1} align='center' />
					<Text bold size='sm' text={withCommas(data?.brate)} flex={1} align='center' />
					<Text
						bold
						size='sm'
						className={clsx(valueOfPlusMinus(Number(parsed?.profit?.value)))}
						text={parsed?.profit?.value}
						flex={1}
						align='center'
					/>
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
