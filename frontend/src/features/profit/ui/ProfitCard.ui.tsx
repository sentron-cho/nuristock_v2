import Flex from '@entites/Flex';
import { ProfitItemType as DataType } from '../api/profit.dto';
import { StyledCard } from '../style/ProfitCard.style';
import clsx from 'clsx';
import { Text } from '@entites/Text';
import { SubTitle } from '@entites/Title';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { reverse, sortBy } from 'lodash';
import { ST } from '@shared/config/kor.lang';

export const ProfitCard = ({
	data,
	// onClick,
}: {
	data?: DataType[]; // 년도별 데이터
	// onClick?: (eid?: string) => void;
}) => {
	// const handleClick = (eid?: string) => {
	// 	onClick?.(eid);
	// };

	const makeSumData = (columnKey: 'name' | 'month' = 'name') => {
		return data?.reduce(
			(acc, curr) => {
				let key = (curr as Record<string, any>)[columnKey] as string;

				if (columnKey === 'month') {
					key = dayjs(curr.edate).format('YYYY-MM');
					curr['title'] = key;
				} else {
					curr['title'] = key;
				}

				// 초기화
				if (!acc[key]) {
					acc[key] = { ...curr, sonic: 0, scost: 0, ecost: 0, sprice: 0, eprice: 0, count: 0 } as DataType;
				}

				acc[key].scost = (acc[key].scost || 0) + (curr.scost || 0);
				acc[key].ecost = (acc[key].ecost || 0) + (curr.ecost || 0);
				acc[key].count = (acc[key].count || 0) + (curr.count || 0);
				acc[key].sprice = (acc[key].sprice || 0) + (curr.sprice || 0);
				acc[key].eprice = (acc[key].eprice || 0) + (curr.eprice || 0);
				acc[key].edate = curr.edate;
				acc[key].sonic = (acc[key].sonic || 0) + (curr.eprice || 0) - (curr.sprice || 0);

				return acc;
			},
			{} as Record<string, DataType>
		);
	};

	// 종목별 합계 구하기
	const nameData = useMemo(() => {
		const list = makeSumData('name');
		const sortedBySonic = list ? Object.values(list).sort((a, b) => Number(b?.sonic) - Number(a?.sonic)) : [];
		let array: Record<string, DataType> = {};
		sortedBySonic.forEach((item) => {
			item?.name && (array[item.name] = item);
		});

		console.log({ array });
		return array;
	}, [data]);

	const nameList = useMemo(() => {
		return nameData ? Object.keys(nameData) : [];
	}, [nameData]);

	// 월별 합계 구하기
	const yearData = useMemo(() => {
		return makeSumData('month');
	}, [data]);

	const yearList = useMemo(() => {
		return yearData ? reverse(sortBy(Object.keys(yearData))) : [];
	}, [yearData]);

	console.log({ nameData, nameList });

	// const type = valueOfPlusMinus(item.sum, 0);

	return (
		<StyledCard className={clsx('card')}>
			<Flex className={clsx('box')} direction='column' gap={10}>
				{/* 종목별 */}
				<Flex className='names' direction={'column'} gap={10}>
					<Flex className='head' justify={'between'}>
						<SubTitle title={ST.PER_CODES} width={'100%'} textAlign={'center'} />
					</Flex>

					<Flex direction={'column'} className='body' gap={8}>
						{nameList?.map((title) => {
							const item = nameData?.[title];
							const type = valueOfPlusMinus(item?.sonic, 0);
							return (
								<Flex className={clsx(type)} direction={'row'} justify={'between'}>
									<Text text={title} />
									<Text text={toCost(item?.sonic)} />
								</Flex>
							);
						})}
					</Flex>
				</Flex>

				{/* 월별 */}
				<Flex className='years' direction={'column'} gap={10}>
					<Flex className='head bar' justify={'between'}>
						<SubTitle title={ST.PER_MONTHS} width={'100%'} textAlign={'center'} />
					</Flex>

					<Flex direction={'column'} className='body' gap={8}>
						{yearList?.map((title) => {
							const item = yearData?.[title];
							const type = valueOfPlusMinus(item?.sonic, 0);
							return (
								<Flex className={clsx(type)} direction={'row'} justify={'between'}>
									<Text text={title} />
									<Text text={toCost(item?.sonic)} />
								</Flex>
							);
						})}
					</Flex>
				</Flex>
			</Flex>
		</StyledCard>
	);
};
