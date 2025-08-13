import { Card } from '@entites/Card';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { InvestmentItemType } from '../api/investment.dto';
import { IconRefresh } from '@entites/Icons';
import { Text } from '@entites/Text';
import { toShortCost, withCommas } from '@shared/libs/utils.lib';

export const InvestmentDetailCard = ({
	title,
	data,
	onClick,
	onClickReport,
}: {
	title?: string;
	data?: InvestmentItemType[];
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
	onClickReport?: (eid?: string, item?: InvestmentItemType) => void;
}) => {
	console.log({ data });

	return (
		<Card>
			<Flex className='box border' direction='column'>
				<Flex className='head' justify={'between'}>
					<Title title={title} />
					<IconRefresh onClick={() => onClick?.('all', data?.[0])} />
				</Flex>
				<Flex className='body' direction={'column'} gap={4}>
					{data?.map((item) => {
						const profit = toShortCost(item?.profit);
						
						return (
							<Flex flex={1} justify={'between'}>
								<Flex gap={10}>
									<Title title={item?.sdate} />
									<Text text={item?.roe} />
									<Text text={withCommas(item?.count)} />
									<Text text={`${profit?.value} ${profit?.unit}`} />
									<Text text={`${item?.brate}%`} />
								</Flex>
								<IconRefresh onClick={() => onClickReport?.(item.sdate.toString(), item)} />
							</Flex>
						);
					})}
				</Flex>
			</Flex>
		</Card>
	);
};
