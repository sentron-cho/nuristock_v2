import { styled } from '@stitches/react';
import { Button, ButtonGroup as ButtonLayer } from 'reactstrap';
import { MouseEvent, useEffect, useState } from 'react';

const StyledComponent = styled(ButtonLayer, {
	'.btn': {
		border: '1px solid transparent',

		// '&.active': {
		// 	border: '1px solid transparent',
		// 	background: '$primary',
		// },
	},
});

export interface IButtonItem {
	label: string;
	value: string;
	className?: string;
	color?: string;
	activeColor?: string;
}

const ButtonGroup = ({
	items,
	size = 'sm',
	onClick,
	className = '',
	width = 'auto',
	color = '',
	activeColor = '',
	defaultSelected = '',
}: {
	items: IButtonItem[];
	size: 'sm' | 'md';
	onClick?: (value: string, e?: MouseEvent) => void;
	className?: string;
	width?: string;
	color?: string;
	activeColor?: string;
	defaultSelected?: IButtonItem | string;
}) => {
	const [selected, setSelected] = useState<IButtonItem | string | null>(
		defaultSelected || null
	);

	return (
		<StyledComponent className={`${className}`} style={{ width: width }}>
			{items.map((item) => {
				const selectionValue =
					typeof selected === 'string' ? selected : selected?.value;
				const isActive = selectionValue === item.value;
				const btnColor = () => {
					if (isActive) {
						return item.activeColor || activeColor || 'primary';
					} else {
						return item.color || color || 'secondary';
					}
				};

				return (
					<Button
						key={`btn-${item.value}`}
						color={btnColor()}
						className={isActive ? 'active' : ''}
						size={size}
						// style={{
						// 	background: isActive && item.activeColor ? item.activeColor : '',
						// }}
						onClick={(e) => {
							e.stopPropagation();
							setSelected(item);
							onClick?.(item.value, e);
						}}
					>
						{item.label}
					</Button>
				);
			})}
		</StyledComponent>
	);
};

export default ButtonGroup;
