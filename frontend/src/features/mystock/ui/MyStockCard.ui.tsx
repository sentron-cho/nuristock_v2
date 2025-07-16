import { ST } from '@shared/config/kor.lang';
import {
	MyStockKeepType as KeepType,
	MyStockSellType as SellType,
	MyStockSiseItemType as SiseType,
} from '../api/mystock.dto';
import { toCost, valueOfDateDiff, valueOfPlusMinus, withCommas } from '@shared/libs/utils.lib';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import Typography from '@mui/material/Typography';
import { IconUp, IconDown } from '@entites/Icons';
import { Button } from '@entites/Button';
import { useMemo } from 'react';
import { EID } from '@shared/config/default.config';
import dayjs from 'dayjs';
import { IconButton, IconType } from '@entites/IconButton';
import Flex from '@entites/Flex';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';

const StyledCard = styled(Card, {
	width: '33.33333%',
	height: '240px',
	boxShadow: 'unset !important',
	padding: '$4',

	'&.card': {
		backgroundColor: 'transparent',
		'&.keep': {
			cursor: 'pointer',
			height: '300px',
		},

		'.box': {
			backgroundColor: '$white',
			borderRadius: '$sm',
			border: '1px solid rgba(0,0,0,0.05)',
			boxShadow: 'var(--Paper-shadow);',
			overflow: 'hidden',
			height: '100%',
			padding: '$4',

			'.head, .foot, .body': {
				padding: '0 $4',
			},

			'.trade-info, .keep-info, .sell-info': {
				'&.keep-info, &.sell-info': {
					borderTop: '1px solid $gray300',
				},

				padding: '8px',
			},

			'.head': {
				height: '40px',
				borderBottom: '1px solid $gray300',

				'.left': {},
			},

			'.body': {
				borderBottom: '1px solid $gray300',
				overflow: 'hidden',
				flex: 1,

				'.b-item': {
					borderTop: '1px solid $gray300',
					paddingTop: '$10',
				},
			},

			'.foot': {
				height: '40px',

				'.naver, .daum': {
					'&.naver': {
						backgroundColor: '#00c73c',
					},
					'&.daum': {
						backgroundColor: '#fcce00',
						color: '$black',
					},
				},
			},

			'.plus': {
				color: '$plus',
			},

			'.minus': {
				color: '$minus',
			},
		},

		'&.active': {
			'.box': {
				borderColor: '$gray700',
			},
		},
	},

	'@lg': {
		width: '50%',
	},
	'@md': {
		width: '100%',
	},
});

export const MyStockCard = ({
	data,
	sise,
	viewType,
	onClick,
}: {
	data: KeepType | SellType;
	sise?: SiseType;
	viewType: 'keep' | 'trade';
	onClick?: (eid?: string, item?: KeepType | SellType) => void;
}) => {
	console.log('[DashboardCard]', { sise, data });

	const handleClick = (eid?: string) => {
		onClick?.(eid, data);
	};

	const type = valueOfPlusMinus(sise?.sise, data.scost);

	// const handleSiseClick = (e: React.MouseEvent) => {
	// 	e.stopPropagation();
	// 	onClick?.('sise', data);
	// };

	return (
		<StyledCard className={clsx('card', type, viewType, { sm: !history })}>
			<Flex className='box' direction='column' onClick={() => handleClick(EID.SELECT)}>
				{viewType === 'keep' && <KeepContents data={data as KeepType} sise={sise} />}
				{viewType === 'trade' && <TradeContents data={data as SellType} />}

				<Flex className='foot' justify={'between'}>
					<Flex gap={8} style={{ visibility: viewType === 'keep' ? 'visible' : 'hidden' }}>
						<Button eid='sell' size='small' title={ST.SELL} onClick={handleClick} />
						<Button eid='calc' size='small' title={ST.CALC} onClick={handleClick} />
					</Flex>
					<Flex gap={8} fullWidth={false}>
						<IconButton type={IconType.EDIT} eid='edit' onClick={handleClick} />
						<IconButton type={IconType.DELETE} eid='delete' onClick={handleClick} />
					</Flex>
				</Flex>
			</Flex>
		</StyledCard>
	);
};

const TradeContents = ({ data }: { data: SellType }) => {
	const values = useMemo(() => {
		const makeTrade = (data: SellType, type?: 'sell' | 'buy') => {
			const cost = type === 'buy' ? data?.scost : data?.ecost;
			const date = type === 'buy' ? data?.sdate : data?.edate;
			return {
				title: type === 'buy' ? ST.BUY : ST.SELL,
				text: data?.count ? `${withCommas(data.count)} x ${withCommas(cost)}` : '',
				value: data.count * cost,
				date: dayjs(date).format('YYYY-MM-DD'),
			};
		};

		const buy = makeTrade(data, 'buy');
		const sell = makeTrade(data, 'sell');
		const trade = {
			title: ST.YEAR_SONIC,
			text: '',
			value: '',
			date: ``,
		}

		const keepDate = valueOfDateDiff(data.sdate, new Date());
		const soinc = sell.value - buy.value;

		const rate = Number((soinc / sell?.value) * 100).toFixed(1);

		return {
			buy,
			sell,
			trade,
			soinc,
			rate,
			keepDate,
		};
	}, [data]);

	const type = valueOfPlusMinus(data.ecost, data.scost);

	return (
		<>
			<Flex className='head' justify='between'>
				<Flex gap={0} className={clsx('left', type)} flex={1}>
					{type === EID.MINUS && <IconDown />}
					{type === EID.PLUS && <IconUp />}

					<Typography fontWeight={'bold'} className='title'>
						{toCost(values?.soinc)}
					</Typography>

					<Typography fontWeight={'bold'} className='rate'>
						{`(${ST.SONIC_RATE} ${values?.rate}%)`}
					</Typography>
				</Flex>

				<Flex gap={4} className='right' width='fit-contents'>
					<Typography fontWeight={'bold'} className='date'>
						{dayjs(data?.ctime).format('YYYY/MM/DD')}
					</Typography>
				</Flex>
			</Flex>

			<Flex gap={8} className='body' direction='column' justify='start'>
				{data ? (
					<Flex className='layout' direction={'column'} flex={1}>
						{/* 매수/매도 */}
						<Flex className='trade-info' direction='column' align='start' gap={10}>
							<CardLineFiled {...values.buy} value={withCommas(values?.buy.value)} />
							<CardLineFiled className={type} {...values.sell} value={withCommas(values?.sell.value)} />
						</Flex>

						{/* 연수익/보유일 */}
						<Flex className='keep-info' direction='column' align='start' gap={10} flex={1}>
							<CardLineFiled className={type} {...values.trade} value={withCommas(values?.trade.value)} />
							<CardLineFiled title={ST.KEEP_DATE} value={values?.keepDate} suffix={{}} />
						</Flex>
					</Flex>
				) : (
					<div className='noitem'>{ST.NO_HISTORY}</div>
				)}
			</Flex>
		</>
	);
};

const KeepContents = ({ data, sise }: { data: KeepType; sise?: SiseType }) => {
	const values = useMemo(() => {
		const makeSise = (data: KeepType, per: number = 0, title?: string) => {
			const targetCost = data.scost * (per === 0 ? 1 : (1 * per) / 100);

			return {
				title: title || `${ST.KEEP_SISE}(${per}%)`,
				text: data?.count ? `${withCommas(data.count)} x ${withCommas(targetCost)}` : '',
				value: data.count * targetCost,
			};
		};

		const buy = makeSise(data, 0, ST.BUY);
		const sell = makeSise({ ...data, scost: sise?.sise || 0 }, 0, ST.SELL);
		const siseA = makeSise(data, 10);
		const siseB = makeSise(data, 20);
		const siseC = makeSise(data, 30);

		const keepDate = valueOfDateDiff(data.sdate, new Date());
		const soinc = sell.value - buy.value;

		const rate = Number((soinc / sell?.value) * 100).toFixed(1);

		return {
			buy,
			sell,
			siseA,
			siseB,
			siseC,
			soinc,
			rate,
			keepDate,
		};
	}, [data, sise]);

	const type = valueOfPlusMinus(sise?.sise, data.scost);

	return (
		<>
			<Flex className='head' justify='between'>
				<Flex gap={0} className={clsx('left', type)} flex={1}>
					{type === EID.MINUS && <IconDown />}
					{type === EID.PLUS && <IconUp />}

					<Typography fontWeight={'bold'} className='title'>
						{toCost(values?.soinc)}
					</Typography>

					<Typography fontWeight={'bold'} className='rate'>
						{`(${ST.SONIC_RATE} ${values?.rate}%)`}
					</Typography>
				</Flex>

				<Flex gap={4} className='right' width='fit-contents'>
					<Typography fontWeight={'bold'} className='date'>
						{dayjs(data?.ctime).format('YYYY/MM/DD')}
					</Typography>
				</Flex>
			</Flex>

			<Flex gap={8} className='body' direction='column' justify='start'>
				{data ? (
					<Flex className='layout' direction={'column'} flex={1}>
						{/* 매수/예상 */}
						<Flex className='trade-info' direction='column' align='start' gap={10}>
							<CardLineFiled {...values.buy} value={withCommas(values?.buy.value)} />
							<CardLineFiled {...values.siseA} value={withCommas(values.siseA.value)} />
							<CardLineFiled {...values.siseB} value={withCommas(values.siseB.value)} />
							<CardLineFiled {...values.siseC} value={withCommas(values.siseC.value)} />
						</Flex>
						{/* 현재가 매도시 */}
						<Flex className={clsx('sell-info', type)} direction='column' align='start' gap={10}>
							<CardLineFiled {...values.sell} value={withCommas(values.sell.value)} />
						</Flex>
						{/* 보유일 */}
						<Flex className='keep-info' direction='column' align='start' gap={10} flex={1}>
							<CardLineFiled title={ST.KEEP_DATE} value={values?.keepDate} suffix={{}} />
						</Flex>
					</Flex>
				) : (
					<div className='noitem'>{ST.NO_HISTORY}</div>
				)}
			</Flex>
		</>
	);
};
