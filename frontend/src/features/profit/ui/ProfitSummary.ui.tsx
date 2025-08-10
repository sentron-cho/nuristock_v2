import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { SubTitle } from '@entites/Title';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { ST } from '@shared/config/kor.lang';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

export const ProfitSummary = ({ data }: { data?: FieldValues }) => {
	const item = useMemo(() => {
		const total = Number(data?.dividend) + Number(data?.sum);

		return {
			type: data?.type,
			buy: toCost(data?.buyTotal),
			sell: toCost(data?.sellTotal),
			sonic: toCost(data?.sum),
			sonicRate: `${((Number(data?.sum) / Number(data?.buyTotal)) * 100).toFixed(1)} %`,
			dividend: toCost(data?.dividend),
			dividendRate: `${((Number(data?.dividend) / Number(data?.buyTotal)) * 100).toFixed(1)} %`,
			total: toCost(total),
			totalType: valueOfPlusMinus(total),
			totalRate: `${((Number(total) / Number(data?.buyTotal)) * 100).toFixed(1)} %`,
		};
	}, [data]);

	return (
		<ContentsHeader>
			{item && (
				<Flex direction={'column'}>
					{/* 매수 */}
					<SummaryField title={ST.BUY} value={item.buy} />

					{/* 매도 */}
					<SummaryField title={ST.SELL} value={item.sell} type={item.type} />

					{/* 손익 */}
					<SummaryField title={ST.SONIC} value={item.sonic} type={item.type} text={item.sonicRate} />

					{/* 배당 */}
					{data?.dividend && (
						<SummaryField title={ST.DIVIDEND} value={item.dividend} type={'plus'} text={item.dividendRate} />
					)}

					{/* 배당이 있을 경우 합계 */}
					{data?.dividend && (
						<SummaryField title={ST.TOTAL} value={item.total} type={item.totalType} text={item.totalRate} />
					)}
				</Flex>
			)}
		</ContentsHeader>
	);
};

const StyledField = styled(Flex, {
	'.rate': {
		position: 'absolute',
		transform: 'translateX(50%)',
		right: '52%',
		width: '60px',
		textAlign: 'right',
	},
});

const SummaryField = ({
	type,
	title,
	text,
	value,
}: {
	type?: string;
	title?: string;
	text?: string;
	value: string;
}) => {
	return (
		<StyledField className={clsx(type)} justify={'between'}>
			<SubTitle className='title' title={title} flex={1} />
			{text && <Text size='sm' className={clsx('rate', type)} align='right' text={text} />}
			<Text className={clsx('sum', type)} bold flex={1} align='right' text={value} />
		</StyledField>
	);
};
