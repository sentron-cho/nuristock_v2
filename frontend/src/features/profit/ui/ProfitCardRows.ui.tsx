import Flex from '@entites/Flex';
import { Text, TextProps } from '@entites/Text';
import { SubTitle } from '@entites/Title';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import clsx from 'clsx';
import { ProfitItemType } from '../api/profit.dto';
import { styled } from '@styles/stitches.config';
import { ReactNode } from 'react';

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
	},
});

export const ProfitCardRows = ({
	title,
	className,
	data,
	onClickTitle,
	onClickItem,
	rowHeight = 24,
}: {
	title?: string;
	className?: string;
	data?: ProfitItemType[];
	onClickTitle?: (eid: string) => void;
	onClickItem?: (item: ProfitItemType) => void;
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
						<ProfitCardField
							key={`profit-${index}`}
							type={type}
							title={title}
							text={sonicRate ? `${sonicRate} %` : undefined}
							value={toCost(sonic)}
							onClick={() => onClickItem?.(item)}
							height={rowHeight}
						/>
					);
				})}
			</Flex>
		</StyledFlex>
	);
};

const StyledRow = styled(Flex, {
	'&.row': {
		position: 'relative',
		padding: '4px',

		'.main-row': {
		},

		'.sub-row': {
			paddingLeft: '8px',
		},

		// p: {
		// 	'&.title': {
		// 		fontSize: '16px',
		// 	},
		// },

		'.title': {
			color: 'black',
		},

		'.rate': {
			position: 'absolute',
			transform: 'translateX(50%)',
			right: '52%',
			width: '60px',
			textAlign: 'right',
		},
	},
});

export const ProfitCardField = ({
	type,
	title,
	text,
	value,
	height = 24,
	onClick,
	titleProps,
	children,
}: {
	type?: string;
	title?: string;
	text?: string;
	value?: string;
	height?: number | string;
	onClick?: () => void;
	titleProps?: TextProps;
	children?: ReactNode;
}) => {
	return (
		<StyledRow
			className={clsx(type, 'row')}
			direction={'column'}
			justify={'center'}
			onClick={() => onClick?.()}
			height={children ? 'auto' : height}
			gap={4}
		>
			<Flex className='main-row' direction={'row'}>
				{title && <Text className='title' text={title} flex={1} {...titleProps} />}
				{text && <Text className='rate' size='xs' align='right' text={text} />}
				<Text className='value' text={value} flex={1} align={'right'} />
			</Flex>

			{children && (
				<Flex className='sub-row' direction={'row'}>
					{children}
				</Flex>
			)}
		</StyledRow>
	);
};
