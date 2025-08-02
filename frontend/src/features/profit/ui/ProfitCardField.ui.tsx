import Flex from '@entites/Flex';
import { Text } from '@entites/Text';
import { SubTitle } from '@entites/Title';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import { ProfitItemType as DataType } from '../api/profit.dto';
import { styled } from '@styles/stitches.config';

const StyledFlex = styled(Flex, {
	'.plus': {
		color: '$plus',
	},

	'.minus': {
		color: '$minus',
	},

	'.head, .body': {
		padding: '0 $4',

		'&.bar': {
			borderTop: '1px solid $gray300',
		},
	},

	'.head': {
		height: '40px',
		borderBottom: '1px solid $gray300',

		'.date': {
			color: '$gray700',
		},
	},

	'.body': {
		flex: 1,

		'.row': {
			position: 'relative',
			'.rate': {
				position: 'absolute',
				transform: 'translateX(50%)',
				right: '52%',
				width: '60px',
				textAlign: 'right',
			},
		},
	},
});

export const ProfitCardField = ({
	title,
	className,
	data,
	onClick,
}: {
	title?: string;
	className?: string;
	data?: DataType[];
	onClick?: (eid: string) => void;
}) => {
	return (
		<StyledFlex className={clsx('card-field', className)} direction={'column'} gap={10}>
			{title && <Flex className='head' justify={'between'} onClick={() => onClick?.('code')}>
				<SubTitle title={title} width={'100%'} textAlign={'center'} />
			</Flex>}

			<Flex direction={'column'} className='body' gap={8}>
				{data?.map((item) => {
					const { title, sonic, sonicRate } = item;
					const type = valueOfPlusMinus(sonic, 0);
					return (
						<Flex className={clsx(type, 'row')} direction={'row'} justify={'between'}>
							<Text className='title' text={title} flex={1} />
							<Text className='rate' size='xs' align='right' text={`${sonicRate} %`} />
							<Text className='value' text={toCost(sonic)} flex={1} align={'right'} />
						</Flex>
					);
				})}
			</Flex>
		</StyledFlex>
	);
};
