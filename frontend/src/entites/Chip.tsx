import { Stack, Chip as MuiChip, ChipProps as MuiChipProps, StackProps } from '@mui/material';
import { styled } from '@stitches/react';
import clsx from 'clsx';

export interface ChipProps extends Omit<MuiChipProps, 'onClick' | 'size'> {
	label: string;
	id?: string;
	value?: string;
	size?: 'small' | 'xsmall' | 'medium';
	onClick?: (eid?: string) => void;
}

const StyledChip = styled(MuiChip, {
	'&.chip': {
		borderRadius: '4px',

		'&.xsmall': {
			height: '20px',
			lineHeight: '18px',
			borderRadius: '4px',

			'.MuiChip-label': {
				padding: '0 4px',
				fontSize: '12px',
			},
		},

		'&.small': {
			borderRadius: '4px',
		},

		'&.medium': {
			borderRadius: '6px',
		},

		'&.large': {
			borderRadius: '10px',
		},
	},
});

export const Chip = (props: ChipProps) => {
	return (
		<StyledChip
			variant='outlined'
			{...props}
			size={props?.size as MuiChipProps['size']}
			className={clsx('chip', props?.size, props?.className)}
			onClick={() => props?.onClick?.(props?.id || props?.value)}
		/>
	);
};

export interface ChipStackProps extends StackProps {
	direction?: StackProps['direction'];
	spacing?: StackProps['spacing'];
	data?: ChipProps[];
}

export const ChipStack = ({ data, direction, spacing, ...rest }: ChipStackProps) => {
	return (
		<Stack direction={direction} spacing={spacing} {...rest}>
			{data?.map((item) => {
				return <Chip {...item} />;
			})}
		</Stack>
	);
};
