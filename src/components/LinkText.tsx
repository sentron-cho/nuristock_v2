import { styled } from '@stitches/react';
import { MouseEvent } from 'react';
import { Button } from 'reactstrap';

const StyledComponent = styled(Button, {
	'&.btn-link': {
		textDecoration: 'none',
	},
});

const LinkButton = ({
	label,
	onClick,
	className = '',
	size = 'sm',
	disabled = false,
}: {
	label?: string;
	onClick?: (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	className?: string;
	size?: 'sm' | 'md';
	disabled?: boolean;
}) => {
	return (
		<StyledComponent
			type='button'
			className={`btn btn-link p-0 px-2 ${className}`}
			color='link'
			size={size}
			disabled={disabled}
			onClick={(e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
				e.stopPropagation();
				onClick?.(e);
			}}
		>
			{label}
		</StyledComponent>
	);
};

export default LinkButton;
