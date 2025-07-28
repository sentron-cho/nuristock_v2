import Flex from '@entites/Flex';
import { ProfitItemType as DataType, ProfitYearsItemType as YearDataType } from '../api/profit.dto';
import { StyledCard } from '../style/ProfitCard.style';
import clsx from 'clsx';
import { Text } from '@entites/Text';
import { SubTitle, Title } from '@entites/Title';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { sortBy } from 'lodash';

export const ProfitCard = ({
	item,
	data,
	// onClick,
}: {
	item: YearDataType;
	data?: DataType[];
	// onClick?: (eid?: string) => void;
}) => {
	// const handleClick = (eid?: string) => {
	// 	onClick?.(eid);
	// };

	const parsedData = useMemo(() => {
		const items = data?.filter((a) => dayjs(a.edate).format('YYYY') === item.year.toString());

		const temp = items?.reduce(
			(acc, curr) => {
				let key = curr['name'] as string;

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

		return temp;
	}, [data]);

	const list = useMemo(() => {
		return parsedData ? sortBy(Object.keys(parsedData)) : [];
	}, [parsedData]);

	const type = valueOfPlusMinus(item.sum, 0);

	return (
		<StyledCard className={clsx('card')}>
			<Flex className={clsx('box')} direction='column' gap={10}>
				<Flex className='head' justify={'between'}>
					<Title title={item.year} />
					<SubTitle className={clsx(type)} title={toCost(item.sum)} />
				</Flex>

				<Flex direction={'column'} className='body' gap={4}>
					{list?.map((title) => {
						const item = parsedData?.[title];
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
		</StyledCard>
	);
};
