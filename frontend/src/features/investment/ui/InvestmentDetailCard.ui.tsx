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
}: {
	title?: string;
	data?: InvestmentItemType[];
	onClick?: (eid?: string, item?: InvestmentItemType) => void;
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
						return (
							<Flex flex={1} justify={'between'}>
								<Flex gap={10}>
									<Title title={item?.sdate} />
									<Text text={item?.roe} />
									<Text text={withCommas(item?.count)} />
									<Text text={toShortCost(item?.brate)} />
									<Text text={item?.profit} />
								</Flex>
								<IconRefresh onClick={() => onClick?.(item.sdate.toString(), item)} />
							</Flex>
						);
					})}
				</Flex>
			</Flex>
		</Card>
	);
};
