import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { SubTitle, Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { toCost } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { styled } from '@styles/stitches.config';
import { IconDelete, IconEdit } from '@entites/Icons';
import { Text } from '@entites/Text';
import { InvestmentChip, InvestmentInfoField, PerValueField } from './InvestmentCommon.ui';
import { IconButton } from '@entites/IconButton';

const StyledCard = styled(Card, {
	'.body': {
		'.empty': {
			color: '$gray600',
		},
	},

	'.title-box': {
		position: 'relative',

		// '.sub-title': {
		// 	paddingLeft: 14,
		// },

		'.chip': {
			border: '1px solid $gray700',
			borderRadius: 100,
			backgroundColor: '$gray',
			width: '20px',
			height: '20px',
			textAlign: 'center',
			lineHeight: '18px',
			fontSize: '$xs',
			fontWeight: 700,
			// position: 'absolute',
			// top: -10,
			// left: -6,

			'&.fnguide': {
				backgroundColor: '$primary',
				borderColor: '$primaryhover',
				color: '$white',
			},

			'&.manual': {
				backgroundColor: '$gray700',
				borderColor: '$gray600',
				color: '$white',
			},
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
					<Flex fullWidth={false} gap={10} flex={1}>
						<Flex className='title-box' fullWidth={false} gap={4}>
							<InvestmentChip data={data} />
							<SubTitle title={`${title}(${data?.code})`} onClick={() => onClick?.(EID.SELECT, data)} />
						</Flex>
						<Text size='xs' text={toCost(data?.sise)} />
					</Flex>
					<Flex fullWidth={false} gap={10}>
						{!isEmpty && <IconButton icon={<IconEdit />} onClick={() => onClick?.(EID.UPDATE, data)} />}
						{<IconButton icon={<IconDelete />} onClick={() => onClick?.(EID.DELETE, data)} />}
					</Flex>
				</Flex>

				{/* 바디 */}
				<Flex className='body' direction={'column'} gap={4}>
					{isEmpty && (
						<Flex className='empty' justify={'center'} onClick={() => onClick?.(EID.UPDATE, data)}>
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
