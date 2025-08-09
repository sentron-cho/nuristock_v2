import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { SubTitle } from '@entites/Title';
import { ContentsHeader } from '@layouts/ui/ContentsHeader.ui';
import { ST } from '@shared/config/kor.lang';
import { toCost } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import { FieldValues } from 'react-hook-form';

export const ProfitPerYearHeader = ({ data }: { data?: FieldValues }) => {
	
	return (
		<ContentsHeader>
			{data && <Flex direction={'column'}>
				<Flex justify={'between'}>
					<SubTitle title={ST.BUY} flex={1} />
					<Text size='sm' flex={1} align='right' text={`${toCost(data?.buyTotal)}`} />
				</Flex>
				<Flex className={clsx(data?.type)} justify={'between'}>
					<SubTitle title={ST.SELL} />
					<Text size='sm' flex={1} align='right' text={`${toCost(data?.sellTotal)}`} />
				</Flex>
				<Flex className={clsx(data?.type)} justify={'between'}>
					<SubTitle title={ST.SONIC} />
					<Text bold flex={1} align='right' className={clsx('sum', data?.type)} text={`${toCost(data?.sum)}`} />
				</Flex>
				{data?.dividend && (
					<Flex className={clsx(data?.type)} justify={'between'}>
						<SubTitle title={ST.DIVIDEND} />
						<Text bold flex={1} align='right' className={clsx('sum', 'plus')} text={`${toCost(data?.dividend)}`} />
					</Flex>
				)}
			</Flex>}
		</ContentsHeader>
	);
};
