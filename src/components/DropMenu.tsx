import {
	DropdownItem,
	DropdownMenu,
	UncontrolledDropdown,
	DropdownToggle,
} from 'reactstrap';
import React, { forwardRef, useEffect, useState } from 'react';
import cs from 'classnames';
import { styled } from '@stitches/react';

export const StyledDropdown = styled(UncontrolledDropdown, {
	'&.drop-box': {
		width: 'fit-content',
		display: 'inline-block',

		'& > button': {
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'row',
			alignItems: 'center',
			minWidth: '80px',
			width: '100%',

			'& > span': {
				width: '100%',
			},
		},

		'.select-guide': {
			color: '$secondary',
			opacity: '0.7',
		},

		'.dropdown-menu': {
			minWidth: 'max-content',
			width: '100%',
			overflow: 'hidden',
			overflowY: 'auto',

			'&::-webkit-scrollbar-track': {
				borderRadius: '4px',
			},

			'&::-webkit-scrollbar-thumb': {
				borderRadius: '4px',
				backgroundClip: 'padding-box',
			},
		},

		'&.icon': {
			'& > button': {
				minWidth: '20px',
			},

			'.dropdown-menu': {
				margin: '0 10px',
			},

			'.dropdown-toggle': {
				margin: '0',
				padding: '0',
				backgroundColor: 'transparent',
				border: 'none',

				'&::after, &::before': {
					border: 'none',
					content: 'none',
				},
			},

			'.btn': {
				color: 'unset',
			},
		},
	},
});

export interface IDropMenuItem {
	value: string | number;
	label: string;
}

export const ALL_ITEM = { value: '', label: '전체' } as IDropMenuItem;
// export const SELECT_ITEM = { value: '', label: '선택하세요' } as IDropMenuItem;

const DropMenu = forwardRef(
	(
		{
			menus,
			select,
			defaultSelect,
			className,
			onSelect,
			icon,
			direction = 'down',
			width = '',
			maxHeight = '240px',
			placeholder = '선택하세요',
			disabled,
		}: {
			menus?: Array<IDropMenuItem>;
			select?: IDropMenuItem;
			defaultSelect?: IDropMenuItem | string | number;
			className?: string;
			icon?: string | React.ReactNode;
			onSelect?: (value: IDropMenuItem) => void;
			direction?: 'down' | 'up' | 'left' | 'right';
			width?: string;
			maxHeight?: string;
			placeholder?: string;
			disabled?: boolean;
		},
		ref?: React.Ref<HTMLInputElement>
	) => {
		const [selection, setSelection] = useState<
			IDropMenuItem | string | number | undefined
		>(defaultSelect);
		// const refPrevMenus = useRef<Array<IDropMenuItem> | undefined>(menus);

		useEffect(() => {
			select && setSelection(select);
		}, [select]);

		const parseSelection = (
			selected: IDropMenuItem | string | number | undefined
		) => {
			if (!menus || !selected) return { value: '', label: '' };

			if (typeof selected === 'string' || typeof selected === 'number') {
				return menus.find((a) => String(a.value) === String(selected));
			} else if (typeof selected === 'object') {
				return selected;
			} else {
				return { value: '', label: '' };
			}
		};

		const onClickMenus = (value: IDropMenuItem) => {
			setSelection(value);
			onSelect && onSelect(value);
		};

		return (
			<StyledDropdown
				className={cs(`drop-box my-0 ${className || ''}`, { icon: icon })}
				direction={direction}
				style={{ width: width || '' }}
			>
				{/* ref 제어를 위한 사용 */}
				<input
					ref={ref}
					value={parseSelection(selection)?.value || ''}
					style={{ display: 'none' }}
					onChange={() => {}}
				/>

				<DropdownToggle
					caret
					className={
						icon ? '' : 'border border-secondary-subtle bg-white text-black'
					}
					disabled={disabled}
				>
					{icon ? (
						icon
					) : (
						<span
							className={parseSelection(selection)?.label ? '' : 'select-guide'}
						>
							{parseSelection(selection)?.label || placeholder}
						</span>
					)}
				</DropdownToggle>

				{menus && (
					<DropdownMenu
						className='border border-secondary-subtle bg-white text-black'
						style={{ maxHeight: maxHeight }}
					>
						{menus.map((item, idx) => (
							<DropdownItem
								key={`${item.label}-${idx}`}
								value={item.value}
								onClick={() => onClickMenus(item)}
							>
								<span className='mx-0'>{item.label}</span>
							</DropdownItem>
						))}
					</DropdownMenu>
				)}
			</StyledDropdown>
		);
	}
);

export default DropMenu;
