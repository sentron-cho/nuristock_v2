import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { SubTitle } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { IconEdit, IconRefresh } from '@entites/Icons';
import dayjs from 'dayjs';
import { Text } from '@entites/Text';
import { InvestmentChip, InvestmentInfoField, PerValueField } from './InvestmentCommon.ui';
import { ST } from '@shared/config/kor.lang';
import { IconButton } from '@entites/IconButton';
import { EID } from '@shared/config/default.config';

export const InvestmentDetailCard = ({
	data,
	onClick,
}: {
	data?: InvestmentItemType;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	return (
		<Card>
			<Flex className='box border' direction='column'>
				<Flex className='head' justify={'between'}>
					<Flex flex={1} gap={10}>
						<Flex className='title-box' fullWidth={false} gap={4}>
							<InvestmentChip data={data} />
							<SubTitle title={`${data?.sdate}${ST.YEAR}`} />
						</Flex>

						<Text size='xs' text={`(${dayjs(data?.utime).format('YYYY-MM-DD HH:mm')})`} />
					</Flex>
					<Flex fullWidth={false}>
						<IconButton icon={<IconRefresh />} onClick={() => onClick?.('refresh', data)} />
						<IconButton icon={<IconEdit />} onClick={() => onClick?.(EID.EDIT, data)} />
						{/* <IconDocument onClick={() => onClickReport?.(data?.sdate?.toString(), data)} /> */}
					</Flex>
				</Flex>
				<Flex className='body' direction={'column'} gap={4}>
					<Flex flex={1} justify={'between'}>
						<Flex direction={'column'} gap={10} justify={'between'}>
							{/* 상장 주식수 */}
							<InvestmentInfoField data={data} />

							{/* 주당가치 */}
							<PerValueField data={data} />
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Card>
	);
};
