import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import { useSelectProfit } from '@features/profit/api/profit.api';
import Flex from '@entites/Flex';
import { useProfitData } from '@features/profit/hook/ProfitData.hook';
import { SubTitle } from '@entites/Title';
import clsx from 'clsx';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { useMemo } from 'react';
import { ProfitCardPerCode } from '@features/profit/ui/ProfitCardPerCode.ui';

const StyledPage = styled(PageContainer, {
	'&.profit-code': {
		'.view-box': {
			paddingBottom: '100px',
			// background: '$gray400',
		},

		'.card-sub-title': {
			width: '100%',
			background: '$bgcolor',
			borderBottom: '1px solid $gray500',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			position: 'sticky',
			top: '0px',
			zIndex: 10,
			justifyContent: 'space-between',
			padding: '0 10px',

			'.sum': {
				'&.plus': {
					color: '$plus',
				},

				'&.minus': {
					color: '$minus',
				},
			},
		},
	},
});

export const ProfitPerCodeMo = () => {
	const { data: profitData } = useSelectProfit();

	const { summary, data } = useProfitData(profitData?.value);

	// 종목별 데이터 추출
	const groupedList = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const { name } = item;
				if (!acc[name]) acc[name] = [];

				acc[name].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	// const sortedList = useMemo(() => {
	// 	const sorted = groupedList ? Object.values(groupedList).sort((a, b) => Number(b?.sonic) - Number(a?.sonic)) : [];
	// 	let array: Record<string, DataType> = {};
	// 	sorted.forEach((item) => {
	// 		item?.name && (array[item.name] = item);
	// 	});

	// 	console.log(array)

	// 	return sorted;
	// }, [groupedList]);

	// const namedList = useMemo(() => groupedList && Object.keys(groupedList), [groupedList]);

	const sortedList = useMemo(() => {
		const namedList = groupedList && Object.keys(groupedList);

		if (namedList) {
			const acc: Record<string, number> = {};
			namedList?.map((name) => {
				acc[name] = groupedList?.[name]?.map((a) => Number(a?.sonic))?.reduce((a, b) => a + b, 0);
			});

			// 값 기준 오름차순 정렬
			const sortedEntries = Object.entries(acc).sort((a, b) => b[1] - a[1]);
			// console.log({ sortedEntries });

			return sortedEntries;
		}

		return undefined;
	}, [groupedList]);

	return (
		<StyledPage className='profit-code' summaryData={summary}>
			<Flex className='view-box' direction={'column'} gap={20}>
				{sortedList?.map((item) => {
					const name = item?.[0];
					const sum = item?.[1];
					const type = valueOfPlusMinus(Number(sum));

					return (
						<Flex direction={'column'}>
							<Flex className={clsx('card-sub-title')} width={200} gap={10} justify={'center'}>
								<SubTitle width={120} align='left' className={clsx('year')} title={`${name}`} />
								<SubTitle className={clsx('sum', type)} title={`${toCost(sum)}`} />
							</Flex>

							<Flex className='card-list'>
								<ProfitCardPerCode data={groupedList?.[name]} />
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</StyledPage>
	);
};
