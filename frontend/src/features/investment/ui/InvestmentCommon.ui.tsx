import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { ST } from '@shared/config/kor.lang';
import clsx from 'clsx';
import { InvestmentItemType } from '../api/investment.dto';
import { styled } from '@styles/stitches.config';
import { useInvestmentPerValueHook } from '../hook/Investment.hook';

const StyledPerValueField = styled(Flex, {
	'&.per-value': {
		marginTop: '10px',
		'.values': {
			paddingLeft: '80px',
		},

		'.up': {
			color: '$plus',
		},

		'.down': {
			color: '$minus',
		},
	},
});

export const PerValueField = ({ data }: { data?: InvestmentItemType }) => {
	const { list } = useInvestmentPerValueHook(data);

	return (
		<StyledPerValueField className='per-value' direction={'column'} gap={10}>
			<Text bold width={'100%'} text={ST.PER_VALUE} textAlign={'start'} />
			<Flex className={'values'} direction={'row'} justify={'between'} gap={4} flex={1}>
				{list?.map((item, index) => {
					return <Text key={`txt-${index}`} className={clsx(item?.updown)} text={`${item.value}${ST.WON}`}></Text>;
				})}
			</Flex>
		</StyledPerValueField>
	);
};
