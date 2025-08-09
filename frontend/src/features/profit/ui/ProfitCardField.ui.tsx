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
			// height: 28,

			p: {
				'&.title': {
					fontSize: '16px',
				},
			},

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
	onClickTitle,
	onClickItem,
	rowHeight = 24,
}: {
	title?: string;
	className?: string;
	data?: DataType[];
	onClickTitle?: (eid: string) => void;
	onClickItem?: (item: DataType) => void;
	rowHeight?: string | number;
}) => {
	return (
		<StyledFlex className={clsx('card-field', className)} direction={'column'} gap={10}>
			{title && (
				<Flex className='head' justify={'between'} onClick={() => onClickTitle?.(title)}>
					<SubTitle title={title} width={'100%'} textAlign={'center'} />
				</Flex>
			)}

			<Flex direction={'column'} className='body'>
				{data?.map((item, index) => {
					const { title, sonic, sonicRate } = item;
					const type = valueOfPlusMinus(sonic, 0);
					return (
						<Flex
							key={`prifit-${index}`}
							className={clsx(type, 'row')}
							direction={'row'}
							justify={'between'}
							onClick={() => onClickItem?.(item)}
							height={rowHeight}
						>
							<Text className='title' text={title} flex={1} />
							{sonicRate && <Text className='rate' size='xs' align='right' text={`${sonicRate} %`} />}
							<Text className='value' text={toCost(sonic)} flex={1} align={'right'} />
						</Flex>
					);
				})}
			</Flex>
		</StyledFlex>
	);
};
