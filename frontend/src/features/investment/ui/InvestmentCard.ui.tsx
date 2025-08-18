import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { toCost } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { styled } from '@styles/stitches.config';
import { IconDelete, IconEdit } from '@entites/Icons';
import { Text } from '@entites/Text';
import { InvestmentInfoField, PerValueField } from './InvestmentCommon.ui';

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
						<Flex direction={'column'} onClick={() => onClick?.(EID.SELECT, data)} gap={10}>
							{/* 상장 주식수 */}
							<InvestmentInfoField data={data} />

							{/* 주당가치 */}
							<PerValueField data={data} />
						</Flex>
					)}
				</Flex>
			</Flex>
		</StyledCard>
	);
};
