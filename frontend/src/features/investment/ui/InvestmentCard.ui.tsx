import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { toCost, toShortCost, withCommas } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { styled } from '@styles/stitches.config';
import { IconDelete, IconEdit } from '@entites/Icons';
import { calcExcessProfit, calcShareholderValue } from '@shared/libs/investment.util';
import { Text } from '@entites/Text';
import { PerValueField } from './InvestmentCommon.ui';

const StyledCard = styled(Card, {
	'.body': {
		'.empty': {
			color: '$gray600',
		},
	},
});

export const InvestmentCard = ({
	title,
	data,
	onClick,
}: {
	title?: string;
	data?: InvestmentItemType;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	const isEmpty = useMemo(() => !data?.roe && !data?.equity, [data]);

	const parsed = useMemo(() => {
		return {
			equity: toShortCost(data?.equity),
			profit: toShortCost(calcExcessProfit({ ...data })),
			shareValue: toShortCost(calcShareholderValue({ ...data })),
		};
	}, [data]);

	return (
		<StyledCard>
			<Flex className='box border' direction='column'>
				{/* 헤드 */}
				<Flex className='head' justify={'between'}>
					<Flex gap={10} flex={1}>
						<Title title={`${title}(${data?.code})`} onClick={() => onClick?.(EID.SELECT, data)} />
						<Text text={toCost(data?.sise)} />
					</Flex>
					<Flex fullWidth={false} gap={10}>
						{!isEmpty && <IconEdit onClick={() => onClick?.(EID.UPDATE, data)} />}
						{<IconDelete onClick={() => onClick?.(EID.DELETE, data)} />}
					</Flex>
				</Flex>

				{/* 바디 */}
				<Flex className='body' direction={'column'} gap={4}>
					{isEmpty && (
						<Flex className='empty' justify={'center'} onClick={() => onClick?.('refresh', data)}>
							<Title title={`${dayjs().format('YYYY')}${ST.EMPTY_INVESTMENT}`} />
						</Flex>
					)}

					{!isEmpty && (
						<Flex flex={1} direction={'column'} gap={4} onClick={() => onClick?.(EID.SELECT, data)}>
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
					)}
				</Flex>
			</Flex>
		</StyledCard>
	);
};
