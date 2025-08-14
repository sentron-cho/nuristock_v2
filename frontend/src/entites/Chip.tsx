import { Stack, Chip as MuiChip, ChipProps as MuiChipProps, StackProps } from '@mui/material';

export interface ChipProps extends Omit<MuiChipProps, 'onClick'> {
	label: string;
	id?: string;
	value?: string;
	onClick?: (eid?: string) => void;
}

export const Chip = (props: ChipProps) => {
	return <MuiChip size='small' {...props} onClick={() => props?.onClick?.(props?.id || props?.value)} />;
};

export interface ChipStackProps extends StackProps {
	direction?: StackProps['direction'],
	spacing?: StackProps['spacing']
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