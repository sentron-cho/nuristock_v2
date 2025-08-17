import { IconAlert } from '@entites/Icons';
import { IconProps } from '@mui/material';
import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { ReactNode } from 'react';
// import { styled } from '@mui/material/styles';

const StyledTooltip = styled(MuiTooltip, {
	position: 'relative',

	'&.tooltip.icon': {
		position: 'absolute',
		height: '20px',
		width: '20px',
		top: 'calc(50% - 10px)',
		right: '$4',
	},
});

export const Tooltip = ({
	message,
	color = 'error',
	className,
	placement = 'bottom-end',
	open,
}: {
	message?: string | ReactNode;
	color?: IconProps['color'];
	className?: string;
	placement?: TooltipProps['placement'];
	open?: boolean;
}) => {
	return (
		<StyledTooltip className={clsx('tooltip', className)} open={open} title={message} arrow placement={placement}>
			<IconAlert className='icon' color={color} />
		</StyledTooltip>
	);
};
