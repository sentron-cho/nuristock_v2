import { ST } from '@shared/config/kor.lang';
import {
	MyStockKeepType as KeepType,
	MyStockSellType as SellType,
	MyStockSiseItemType as SiseType,
} from '../api/mystock.dto';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import { Button } from '@entites/Button';
import { EID } from '@shared/config/default.config';
import { IconButton, IconType } from '@entites/IconButton';
import Flex from '@entites/Flex';
import { KeepContents, TradeContents } from './MyStockCardContents.ui';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { reverse, sortBy } from 'lodash';
import { SubTitle } from '@entites/Title';
import { NoData } from '@entites/NoData';
import { Card, CardListWrap } from '@entites/Card';

export const MyStcokKeepList = ({
	list,
	onClick,
	sise,
}: {
	list?: KeepType[];
	onClick?: (eid?: string, item?: KeepType) => void;
	sise?: SiseType;
}) => {
	if (!list?.length) return <NoData />;

	return (
		<Flex className={'card-list'}>
			{list?.map((item) => (
				<MyStockCard
					viewType={'keep'}
					key={item.rowid}
					data={item}
					sise={sise}
					onClick={(eid, item) => onClick?.(eid, item as KeepType)}
				/>
			))}
		</Flex>
	);
};

export const MyStcokTradeList = ({
	list,
	onClick,
	sise,
}: {
	list?: SellType[];
	onClick?: (eid?: string, item?: SellType) => void;
	sise?: SiseType;
}) => {
	if (!list?.length) return <NoData />;

	const groupedByYear = useMemo(() => {
		return list.reduce(
			(acc, item) => {
				const year = dayjs(item.edate).format('YYYY'); // '20241104' → '2024'
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(item);
				return acc;
			},
			{} as Record<string, typeof list>
		);
	}, [list]);

	const years = useMemo(() => {
		return reverse(sortBy(Object.keys(groupedByYear)));
	}, [groupedByYear]);

	return (
		<Flex className={'trade-layer'} direction={'column'} gap={20}>
			{years?.map((year) => {
				const items = groupedByYear?.[year];
				const sum = items
					?.map((a) => Number(a?.ecost) * Number(a?.count) - Number(a?.scost) * Number(a?.count))
					?.reduce((a, b) => a + b, 0);
				const type = valueOfPlusMinus(sum);

				return (
					<Flex direction={'column'}>
						{/* 년도 */}
						<Flex className={clsx('trade-sub-title')} width={200} gap={10} justify={'center'}>
							<SubTitle width={60} className={clsx('year')} title={`${year}${ST.YEAR}`} />
							<SubTitle className={clsx('sum', type)} title={`${toCost(sum)}`} />
						</Flex>

						{/* 내역 */}
						<CardListWrap>
							{items?.map((item) => (
								<MyStockCard
									viewType={'trade'}
									key={item.rowid}
									data={item}
									sise={sise}
									onClick={(eid, item) => onClick?.(eid, item as SellType)}
								/>
							))}
						</CardListWrap>
					</Flex>
				);
			})}
		</Flex>
	);
};

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
	const handleClick = (eid?: string) => {
		onClick?.(eid, data);
	};

	const type = valueOfPlusMinus(sise?.sise, sise?.sise ? data.scost : 0);

	return (
		<Card className={clsx('card', type, viewType, { sm: !history })}>
			<Flex className='box border' direction='column' onClick={() => handleClick(EID.SELECT)}>
				{viewType === 'keep' && <KeepContents data={data as KeepType} sise={sise} />}
				{viewType === 'trade' && <TradeContents data={data as SellType} sise={sise} />}

				<Flex className='foot' justify={'between'}>
					<Flex gap={8} style={{ visibility: viewType === 'keep' ? 'visible' : 'hidden' }}>
						<Button eid='sell' size='small' title={ST.SELL} onClick={handleClick} />
						{/* <Button eid='calc' size='small' title={ST.CALC} onClick={handleClick} /> */}
					</Flex>
					<Flex gap={8} fullWidth={false}>
						<IconButton type={IconType.EDIT} eid='edit' onClick={handleClick} />
						<IconButton type={IconType.DELETE} eid='delete' onClick={handleClick} />
					</Flex>
				</Flex>
			</Flex>
		</Card>
	);
};
