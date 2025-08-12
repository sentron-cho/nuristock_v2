import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { withCommas } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { CardLineFiled } from '@features/common/ui/CardLineField.ui';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { styled } from '@styles/stitches.config';
import { IconDelete, IconEdit } from '@entites/Icons';

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
	const isEmpty = useMemo(() => !data?.roe && !data?.bs, [data]);

	return (
		<StyledCard>
			<Flex className='box border' direction='column'>
				{/* 헤드 */}
				<Flex className='head' justify={'between'}>
					<Title title={`${title}(${data?.code})`} flex={1} onClick={() => onClick?.(EID.SELECT, data)} />
					<Flex fullWidth={false} gap={10}>
						{!isEmpty && <IconEdit onClick={() => onClick?.(EID.UPDATE, data)} />}
						{<IconDelete onClick={() => onClick?.(EID.CLEAR, data)} />}
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
							<CardLineFiled title={ST.EXCESS_PROFIT} value={data?.profit} />
							<CardLineFiled title={ST.BS} value={data?.bs} />
						</Flex>
					)}
				</Flex>
			</Flex>
		</StyledCard>
	);
};
