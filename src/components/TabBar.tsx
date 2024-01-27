import { styled } from '@stitches/react';
import { useEffect, useState } from 'react';
import cs from 'classnames';

const StyledComponent = styled('div', {
	'&.tab-bar': {
		margin: '0px',
		padding: '10px 0px',
		height: '60px',
		display: 'flex',
		userSelect: 'none',
		flexDirection: 'row',
		alignItems: 'center',

		'& > div, span': {
			position: 'relative',
			// display: 'inline-block',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
		},

		'.bar': {
			position: 'relative',
			float: 'left',
			left: '20px',
			marginTop: '-2px',
			width: '40px',
		},

		'h1.tit': {
			cursor: 'pointer',
			display: 'inline-block',
			paddingTop: '4px',
			// paddingRight: '20px',

			'&.active': {
				fontWeight: 'bold',
			},
		},

		'.tb-sub': {
			flexGrow: 1,
		},
	},
});

export interface ITabItem {
	value: string | number;
	label: string;
	children?: () => string | React.ReactElement;
}

const TabBar = ({
	items,
	select,
	className = '',
	onSelect,
	children,
}: {
	items: ITabItem[];
	select?: ITabItem;
	className?: string;
	icon?: string | React.ReactNode;
	onSelect?: (value: ITabItem) => void;
	children?: React.ReactNode;
}) => {
	const [selection, setSelection] = useState<ITabItem>(select || items[0]);

	useEffect(() => {
		select && setSelection(select);
	}, [select]);

	const onClickTabs = (value: ITabItem) => {
		setSelection(value);
		onSelect && onSelect(value);
	};

	return (
		<StyledComponent className={`tab-bar ${className || ''}`}>
			<div>
				{items.map((item, index) => {
					return (
						<span key={`tab-${index}`}>
							{index > 0 && <label className='bar'>|</label>}
							<h1
								className={cs('tit fs-4 mb-0', {
									active: selection.value === item.value,
								})}
								onClick={() => onClickTabs(item)}
							>
								{item.label}
							</h1>
							{item.children && item.children()}
						</span>
					);
				})}
			</div>
			{children && <div className={cs('tb-sub')}>{children}</div>}
		</StyledComponent>
	);
};

export default TabBar;
