import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/EditDocument';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, SvgIconProps } from '@mui/material';

export enum IconType {
	DELETE = 'delete',
	EDIT = 'edit',
}

const StyledIconButton = styled(MuiIconButton, {
	'&.icon-button': {
		cursor: 'pointer',
		display: 'flex',
		padding: 0,

		'&.xs': {
			// padding: '0 4px',
			'svg': {
				width: 20,
				height: 20,
			}
		},
		'&.sm': {
			// padding: '0 8px',
			'svg': {
				width: 24,
				height: 24,
			}
		},
		'&.md': {
			// padding: '0 8px',
			'svg': {
				width: 32,
				height: 32,
			}
		},
		'&.lg': {
			// padding: '0 12px',
			'svg': {
				width: 38,
				height: 38,
			}
		}
	}
});

interface IconProps extends Omit<MuiIconButtonProps, 'onClick' | 'className' | 'size' | 'type'> {
	type?: IconType;
	eid?: string;
	// disabled?: boolean;
	className?: string;
	icon?: ReactNode;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	onClick?: (eid?: string) => void;
	iconProps?: SvgIconProps;
}

export const IconButton = ({ type, eid, disabled = false, onClick, className, icon, size = 'sm', ...props }: IconProps) => {
	const onClickIcon = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.(eid || type);
	};

	const iconProps = props?.iconProps || {}

	return (
		<StyledIconButton {...props} className={clsx('icon-button', className, { disabled }, size)} onClick={onClickIcon}>
			{!type && icon && <>{icon}</>}
			
			{type === IconType.DELETE && <IconDelete {...iconProps} />}
			{type === IconType.EDIT && <IconEdit {...iconProps} />}
		</StyledIconButton>
	);
};
