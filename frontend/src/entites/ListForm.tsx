import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { List } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Flex from './Flex';
import clsx from 'clsx';
import { styled } from '@stitches/react';

const StyledListForm = styled(Flex, {
	'&.list-form': {
		height: '100%',
		width: '100%',

		'.list-box': {
			width: '100%',
			height: '100%',
			overflowX: 'hidden',
			overflowY: 'auto',

			'.active': {
				'.MuiButtonBase-root': {
					backgroundColor: '$gray300',
				},
			},

			'.search-text': {
				color: '$error'
			}
		},

		'.readonly': {
			'&.MuiButtonBase-root': {
				textDecoration: 'unset',
				backgroundColor: 'unset',
				cursor: 'default',

				'.MuiTouchRipple-root': {
					display: 'none',
				},

				'&:hover': {
					backgroundColor: 'unset',
				},
			},
		},

		'&.small': {
			'.MuiButtonBase-root': {
				height: '$formMedium',
				lineHigh: '$formMedium',
				fontSize: '$sm',
			},
		},

		'&.medium': {
			'.MuiButtonBase-root': {
				height: '$formMedium',
				lineHigh: '$formMedium',
				fontSize: '$md',
			},
		},

		'&.large': {
			'.MuiButtonBase-root': {
				height: '$formLarge',
				lineHigh: '$formLarge',
				fontSize: '$lg',
			},
		},
	},
});

export interface ListItemType {
	id: string | number;
	text: string;
}

interface ListFormProps {
	type?: 'normal' | 'virtual';
	items?: ListItemType[];
	height?: number | string;
	width?: number | string;
	size?: 'small' | 'medium' | 'large';
	selected?: string | number;
	vitualProps?: {
		itemSize?: number;
	};
	className?: string;
	searchValue?: string;
	onSelect?: (item: ListItemType) => void;
}

export const ListForm: React.FC<ListFormProps> = (props) => {
	const { type = 'normal', size = 'medium', className = '', height = '100%', width = '100%' } = props;

	return (
		<StyledListForm
			direction={'column'}
			className={clsx('list-form', size, className)}
			style={{ height: height, width: width }}
		>
			{type === 'normal' && <StandardList {...props} size={size} />}
			{type === 'virtual' && <VitualList {...props} size={size} height={height} width={width} />}
		</StyledListForm>
	);
};

const SearchText = ({ search, text }: { search?: string; text?: string }) => {
	if (!text) return '';

	const start = search ? text.indexOf(search) : -1;
	if (start < 0 || !search) return text;

	const end = start + search.length;

	// console.log({ start, end, text });

	return (
		<>
			<span>{text?.slice(0, start)}</span>
			<span className='search-text'>{text?.slice(start, end)}</span>
			<span>{text?.slice(end)}</span>
		</>
	);
};

const StandardList: React.FC<ListFormProps> = (props) => {
	const { items, onSelect, selected, searchValue } = props;

	return (
		<List className='list-box'>
			{items?.map((item, index) => {
				const active = selected?.toString() === item?.id?.toString();

				return (
					<ListItem className={clsx({ active })} key={`li-${index}`} disablePadding>
						<ListItemButton className={clsx({ readonly: !onSelect })} onClick={() => onSelect?.(item)}>
							<ListItemText primary={<SearchText search={searchValue} text={item?.text} />} />
						</ListItemButton>
					</ListItem>
				);
			})}
		</List>
	);
};

const VitualList: React.FC<ListFormProps> = (props) => {
	const { items, vitualProps, height, onSelect, selected } = props;
	const { itemSize = 40 } = vitualProps || {};

	// const handleItemClick = (value: string) => {
	// 	console.log('Clicked item index:', value);
	// };

	return (
		<FixedSizeList
			className='list-box'
			height={100}
			width={'100%'}
			itemSize={itemSize}
			itemCount={items?.length || 0}
			overscanCount={5}
			itemData={{ items, onSelect, selected }}
			style={{ height: height }}
		>
			{renderRow}
		</FixedSizeList>
	);
};

const renderRow = (props: ListChildComponentProps) => {
	const { index, style, data } = props;
	const item = (data?.items as ListItemType[])?.[index];
	const active = data?.selected?.toString() === item?.id?.toString();

	return (
		<ListItem className={clsx({ active })} style={style} key={index} component='div' disablePadding>
			<ListItemButton className={clsx({ readonly: !data?.onSelect })} onClick={() => data?.onSelect?.(item)}>
				<ListItemText primary={item?.text} />
			</ListItemButton>
		</ListItem>
	);
};
