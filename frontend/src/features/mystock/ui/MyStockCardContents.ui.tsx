import { ST } from '@shared/config/kor.lang';
import {
	MyStockKeepType as KeepType,
	MyStockSellType as SellType,
	MyStockSiseItemType as SiseType,
} from '../api/mystock.dto';
import { toCost, valueOfDateDiff, valueOfPlusMinus, withCommas } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { IconUp, IconDown } from '@entites/Icons';
import { useMemo } from 'react';
import { EID } from '@shared/config/default.config';
import dayjs from 'dayjs';
import Flex from '@entites/Flex';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';

export const TradeContents = ({ data }: { data: SellType }) => {
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

		const keepDate = valueOfDateDiff(data.sdate, data.edate);
		const soinc = sell.value - buy.value;
		const rate = Number((soinc / sell?.value) * 100).toFixed(1);

		const days = Math.abs(dayjs(data.sdate).diff(dayjs(data.edate), 'day'));
		const target = days < 365 ? 1 : Number((Number(days) / 365).toFixed(1));
		const trade = {
			title: ST.YEAR_SONIC,
			text: ST.YEAR_SONIC_DESC,
			value: (Number(rate) / target).toFixed(1),
			date: '',
		};

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
				<CardContentHead type={type} title={values?.soinc?.toString()} rate={values?.rate} date={data?.ctime} />
			</Flex>

			<Flex gap={8} className='body' direction='column' justify='start'>
				<Flex className='layout' direction={'column'} flex={1}>
					{/* 매수/매도 */}
					<Flex className='trade-info' direction='column' align='start' gap={10}>
						<CardLineFiled {...values.buy} value={withCommas(values?.buy.value)} />
						<CardLineFiled className={type} {...values.sell} value={withCommas(values?.sell.value)} />
					</Flex>

					{/* 연수익/보유일 */}
					<Flex className='keep-info' direction='column' align='start' gap={10} flex={1}>
						<CardLineFiled
							className={type}
							{...values.trade}
							value={withCommas(values?.trade.value)}
							suffix={{ value: '%', text: '' }}
						/>
						<CardLineFiled title={ST.KEEP_DATE} value={values?.keepDate} suffix={{}} />
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};

export const KeepContents = ({ data, sise }: { data: KeepType; sise?: SiseType }) => {
	const values = useMemo(() => {
		const makeSise = (data: KeepType, per: number = 0, title?: string) => {
			const targetCost = Math.round(data.scost * (1 + per / 100));
			const text = data?.count ? `${withCommas(data.count)} x ${withCommas(targetCost)}` : '';

			return {
				title: title || ST.KEEP_SISE,
				// title: title || `${ST.KEEP_SISE}(${per}%)`,
				text: title ? text : text ? `${text}${ST.WON} (${per}%)` : '',
				value: data.count * targetCost,
				type: valueOfPlusMinus(per),
			};
		};

		const buy = makeSise(data, 0, ST.BUY);
		const sell = makeSise({ ...data, scost: sise?.sise || 0 }, 0, ST.SELL);

		const keepDate = valueOfDateDiff(data.sdate, new Date());
		const soinc = sell.value - buy.value;
		const rate = Number((soinc / sell?.value) * 100).toFixed(1);

		const siseMap = [-50, -40, -30, -20, -10, -5, 0, 5, 10, 20, 30, 40, 50];
		const index = siseMap.findIndex((v) => v > Math.round(Number(rate)));

		const siseA = makeSise(data, siseMap[index]);
		const siseB = makeSise(data, siseMap[index + 1]);
		const siseC = makeSise(data, siseMap[index + 2]);

		return {
			buy,
			sell: { ...sell, text: `${sell.text}${ST.WON} (${rate}%)` },
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
				<CardContentHead sise={sise} type={type} title={values?.soinc?.toString()} rate={values?.rate} date={data?.ctime} />
			</Flex>

			<Flex gap={8} className='body' direction='column' justify='start'>
				<Flex className='layout' direction={'column'} flex={1}>
					{/* 매수/현재가 매도시 */}
					<Flex className='trade-info' direction='column' align='start' gap={10}>
						<CardLineFiled {...values.buy} value={withCommas(values?.buy.value)} />
						{sise && <CardLineFiled
							{...values.sell}
							value={withCommas(values.sell.value)}
							type={type}
							suffix={{ text: '', value: ST.WON }}
						/>}
					</Flex>
					{/* 예상 */}
					<Flex className={clsx('cast-info', type)} direction='column' align='start' gap={10}>
						<CardLineFiled
							className='cast'
							{...values.siseA}
							value={withCommas(values.siseA.value)}
							suffix={{ text: '', value: ST.WON }}
						/>
						<CardLineFiled
							className='cast'
							{...values.siseB}
							value={withCommas(values.siseB.value)}
							suffix={{ text: '', value: ST.WON }}
						/>
						<CardLineFiled
							className='cast'
							{...values.siseC}
							value={withCommas(values.siseC.value)}
							suffix={{ text: '', value: ST.WON }}
						/>
					</Flex>
					{/* 보유일 */}
					<Flex className='keep-info' direction='column' align='start' gap={10} flex={1}>
						<CardLineFiled title={ST.KEEP_DATE} value={values?.keepDate} suffix={{}} />
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};

const CardContentHead = ({
	type,
	title,
	rate,
	date,
	sise,
}: {
	type?: string;
	title?: string;
	rate?: string;
	date?: string;
	sise?: SiseType;
}) => {
	return (
		<>
			<Flex gap={0} className={clsx('left', type)} flex={1}>
				{sise && (
					<>
						{type === EID.MINUS && <IconDown />}
						{type === EID.PLUS && <IconUp />}

						<Typography fontWeight={'bold'} className='title'>
							{toCost(title)}
						</Typography>

						<Typography fontWeight={'bold'} className='rate'>
							{`(${ST.SONIC_RATE} ${rate}%)`}
						</Typography>
					</>
				)}
			</Flex>

			<Flex gap={4} className='right' width='fit-contents'>
				<Typography className='date'>{dayjs(date).format('YYYY-MM-DD')}</Typography>
			</Flex>
		</>
	);
};
