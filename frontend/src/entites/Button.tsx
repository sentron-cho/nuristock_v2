import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { useMemo } from 'react';

export interface ButtonProps {
	type?: 'text' | 'fill' | 'outline';
	onClick?: (eid?: string) => void;
	eid?: string;
	icon?: React.ReactNode;
	iconPosition?: 'start' | 'end';
  size?: MuiButtonProps['size'];
  title?: string;
  className?: string;
}

const StyledButton = styled(MuiButton, {
	minHeight: '20px',

	'&.MuiButton-sizeSmall': {
		paddingTop: '2px !important',
		paddingBottom: '2px !important',
		lineHeight: '24px',
	}
})

export const Button = ({
  type = 'fill',
  eid,
  onClick,
  icon,
  iconPosition = 'start',
  size = 'small',
  title = '',
  className,
}: ButtonProps) => {
	const variant = useMemo(() => {
		if (type === 'text') return 'text';
		else if (type === 'outline') return 'outline';
		else return 'contained'; // fill
	}, [type]);

	const onClickButton = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.(eid);
	};

	return (
    <StyledButton
			variant={variant as MuiButtonProps['variant']}
			type='button'
			size={size}
			onClick={onClickButton}
			className={clsx('btn', className)}
			startIcon={iconPosition === 'start' ? icon : undefined}
			endIcon={iconPosition === 'end' ? icon : undefined}
		>
			{title}
		</StyledButton>
	);
};
