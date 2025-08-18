import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { IconDocument, IconRefresh } from '@entites/Icons';
import dayjs from 'dayjs';
import { Text } from '@entites/Text';
import { InvestmentInfoField, PerValueField } from './InvestmentCommon.ui';

export const InvestmentDetailCard = ({
	data,
	onClick,
	onClickReport,
}: {
	data?: InvestmentItemType;
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onClickReport?: (eid?: string, item?: InvestmentItemType) => void;
}) => {

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
