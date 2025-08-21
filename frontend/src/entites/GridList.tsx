import clsx from 'clsx';
import { CardListWrap } from './Card';
import Flex from './Flex';
import { Text, TextProps } from './Text';
import { FieldValues } from 'react-hook-form';
import { ReactNode } from 'react';
import { FlexProps } from 'antd';
import { styled } from '@styles/stitches.config';
import { EID } from '@shared/config/default.config';

export interface GridHeaderType {
	title: string;
	key: string;
	align?: TextProps['align'];
	flex?: FlexProps['flex'];
	formatter?: (v: string, row: FieldValues) => string | ReactNode;
	className?: string;
	width?: string | number;
	size?: TextProps['size'];
	bold?: TextProps['bold'];
}

interface GridListProps {
	header: GridHeaderType[];
	data: FieldValues[];
	headHeight?: string | number;
	rowHeight?: string | number;
	onClick?: (eid: string, item: FieldValues) => void;
}

const StyledGridList = styled(Flex, {
	'&.grid-list': {
		'.grid-list-header': {
			background: '$gray400',
			position: 'sticky',
			top: 0,
			zIndex: '$titleNavi',
			borderBottom: '1px solid $gray500',

			'.grid-head': {
				padding: 10,
			},
		},

		'.list-body-layout': {
			padding: '0',

			'.list-body': {
				'.grid-row': {
					'.grid-col': {
						padding: '0 4px',
					},
				},
			},
		},

		'.minus': {
			color: '$minus',
		},

		'.plus': {
			color: '$plus',
		},
	},
});

export const GridList = ({ header, data, headHeight, rowHeight, onClick }: GridListProps) => {
	const onClickItem = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: FieldValues) => {
		if (onClick) {
			e.stopPropagation();
			onClick(EID.SELECT, item);
		}
	};

	return (
		<StyledGridList className='grid-list' direction={'column'} flex={1}>
			<Flex className='grid-list-header' height={headHeight || 34}>
				{header?.map((head) => {
					return (
						<Flex
							className='grid-head'
							fullWidth={false}
							flex={head?.width ? '' : 1}
							width={head?.width}
							height={'100%'}
						>
							{/* <Text width={'100%'} bold text={head.title} textAlign={head?.align || 'center'} /> */}
							<Text width={'100%'} bold text={head.title} textAlign={'center'} />
						</Flex>
					);
				})}
			</Flex>

			<CardListWrap>
				<Flex className={clsx('list-body-layout')}>
					<Flex className={clsx('list-body')} direction='column' gap={4}>
						{data?.map((item, index) => {
							return (
								<Flex
									key={`grid-${index}`}
									className={'grid-row'}
									justify={'between'}
									height={rowHeight || 28}
									onClick={(e) => onClickItem(e, item)}
								>
									{header?.map((head) => {
										const value = item?.[head?.key];
										const formatedValue = head?.formatter?.(value, item);
										if (formatedValue) {
											if (typeof formatedValue !== 'string') {
												return <GridRow head={head}>{formatedValue}</GridRow>;
											} else {
												return <GridRow head={head} value={formatedValue} />;
											}
										} else {
											return <GridRow head={head} value={value} />;
										}
									})}
								</Flex>
							);
						})}
					</Flex>
				</Flex>
			</CardListWrap>
		</StyledGridList>
	);
};

const GridRow = ({
	head,
	value,
	children,
}: {
	head: GridHeaderType;
	children?: ReactNode;
	value?: string | number;
}) => {
	return (
		<Flex
			fullWidth={false}
			className={clsx('grid-col', head.className)}
			flex={head?.width ? '' : head?.flex || 1}
			width={head?.width}
			height={'100%'}
		>
			{children || (
				<Text size={head?.size} bold={head?.bold} width={'100%'} text={value} align={head?.align || 'center'} />
			)}
		</Flex>
	);
};
