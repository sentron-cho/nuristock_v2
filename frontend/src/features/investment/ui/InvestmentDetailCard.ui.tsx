import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { IconDocument, IconRefresh } from '@entites/Icons';
import { toShortCost, withCommas } from '@shared/libs/utils.lib';
import { calcExcessProfit, calcShareholderValue } from '@shared/libs/investment.util';
import { useMemo } from 'react';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';
import { ST } from '@shared/config/kor.lang';
import dayjs from 'dayjs';
import { Text } from '@entites/Text';
import { PerValueField } from './InvestmentCommon.ui';

export const InvestmentDetailCard = ({
	data,
	onClick,
	onClickReport,
}: {
	data?: InvestmentItemType;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onClickReport?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const parsed = useMemo(
		() => ({
			equity: toShortCost(data?.equity),
			profit: toShortCost(calcExcessProfit({ ...data })),
			shareValue: toShortCost(calcShareholderValue({ ...data })),
		}),
		[data]
	);

	return (
		<Card>
			<Flex className='box border' direction='column'>
				<Flex className='head' justify={'between'}>
					<Flex flex={1} gap={10}>
						<Title title={`${data?.sdate}년`} />
						<Text text={`(${dayjs(data?.utime).format('YYYY-MM-DD HH:mm')})`} />
					</Flex>
					<Flex fullWidth={false}>
						<IconRefresh onClick={() => onClick?.(data?.sdate?.toString(), data)} />
						<IconDocument onClick={() => onClickReport?.(data?.sdate?.toString(), data)} />
					</Flex>
				</Flex>
				<Flex className='body' direction={'column'} gap={4}>
					<Flex flex={1} justify={'between'}>
						<Flex direction={'column'} gap={10} justify={'between'}>
							<CardLineFiled title={ST.ROE} value={data?.roe} suffix={{ value: '%' }} />
							<CardLineFiled title={ST.BASE_RATE} value={withCommas(data?.brate)} suffix={{ value: '%' }} />
							<CardLineFiled title={ST.STOCKS_COUNT} value={withCommas(data?.count)} suffix={{ value: ST.JU }} />
							<CardLineFiled title={ST.EQUITY} value={parsed?.equity?.value} suffix={{ value: parsed?.equity?.unit }} />
							<CardLineFiled
								title={ST.EXCESS_PROFIT}
								value={parsed?.profit?.value}
								suffix={{ value: parsed?.profit?.unit }}
							/>
							<CardLineFiled
								title={ST.SHARE_VALUE}
								value={parsed?.shareValue?.value}
								suffix={{ value: parsed?.shareValue?.unit }}
							/>

							{/* 주당가치 */}
							<PerValueField data={data} />
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Card>
	);
};
