import { IconButton } from '@mui/material';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { useMemo } from 'react';

export interface ButtonProps extends Omit<MuiButtonProps, 'onClick'> {
	buttonType?: 'text' | 'fill' | 'outline' | 'icon';
	onClick?: (eid?: string) => void;
	eid?: string;
	icon?: React.ReactNode;
	iconPosition?: 'start' | 'end';
	title?: string;
	// size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled(MuiButton, {
	minHeight: '20px',

	'&.MuiButton-sizeSmall': {
		padding: '0px 8px !important',
		lineHeight: '$formSmall',
		height: '$formSmall,',
	},

	'&.MuiButton-sizeMedium': {
		paddingTop: '0px 8px !important',
		height: '$formMedium',
		lineHeight: '$formMedium',
	},

	'&.MuiButton-sizeLarge': {
		paddingTop: '0px 8px !important',
		height: '$formLarge',
		lineHeight: '$formLarge',
	},
});

export const Button = ({
	buttonType = 'fill',
	eid,
	onClick,
	icon,
	iconPosition = 'start',
	size = 'small',
	title = '',
	className,
	...props
}: ButtonProps) => {
	const variant = useMemo(() => {
		if (buttonType === 'icon') return 'text';
		else if (buttonType === 'text') return 'text';
		else if (buttonType === 'outline') return 'outlined';
		else return 'contained'; // fill
	}, [buttonType]);

	const onClickButton = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.(eid);
	};

	if (buttonType === 'icon') {
		return (
			<IconButton size={size} onClick={onClickButton} className={clsx('btn', className)}>
				{icon}
			</IconButton>
		);
	}

	return (
		<StyledButton
			variant={variant as MuiButtonProps['variant']}
			type='button'
			size={size}
			onClick={onClickButton}
			className={clsx('btn', className)}
			startIcon={iconPosition === 'start' ? icon : undefined}
			endIcon={iconPosition === 'end' ? icon : undefined}
			{...props}
		>
			{title}
		</StyledButton>
	);
};
