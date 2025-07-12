import { IconAlert } from '@entites/Icons';
import { IconProps } from '@mui/material';
import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
// import { styled } from '@mui/material/styles';

const StyledTooltip = styled(MuiTooltip, {
	position: 'relative',

	'&.tooltip.icon': {
		position: 'absolute',
		height: '24px',
		width: '24px',
		top: 'calc(50% - 12px)',
		right: '$4',
	},
});

export const Tooltip = ({
	message,
	color = 'error',
	className,
	placement = 'bottom-end',
}: {
	message?: string;
	color?: IconProps['color'];
	className?: string;
	placement?: TooltipProps['placement'];
}) => {
	return (
		<StyledTooltip className={clsx('tooltip', className)} title={message} arrow placement={placement}>
			<IconAlert className='icon' color={color} />
		</StyledTooltip>
	);
};
