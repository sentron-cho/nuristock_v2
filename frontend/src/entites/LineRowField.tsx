import Flex from '@entites/Flex';
import { Text, TextProps } from '@entites/Text';
import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import { ReactNode } from 'react';
import { CSSProperties } from '@mui/material';

const StyledRow = styled(Flex, {
	'&.row': {
		position: 'relative',
		padding: '4px',

		'.main-row': {},

		'.sub-row': {
			paddingLeft: '8px',
		},

		'.row-title': {},

		'.row-label': {
			color: '$gray700',
			fontSize: '12px',
			fontStretch: '80%',
		},

		// '.row-text': {
		// 	'.text': {
		// 		fontStretch: '80%',
		// 	}
		// },

		'&.minus, .minus': {
			color: '$minus',
		},

		'&.plus, .plus': {
			color: '$plus',
		},
	},
});

export interface RowFieldProps {
	className?: string;
	type?: string;
	title?: string;
	label?: string;
	text?: string;
	value?: string;
	height?: number | string;
	onClick?: () => void;
	titleProps?: TextProps;
	textProps?: TextProps;
	valueProps?: TextProps;
	children?: ReactNode;
	suffix?: { title?: string; text?: string; value?: string };
	buttons?: ReactNode;
	style?: CSSProperties;
}

export const RowField = ({
	className,
	type,
	title,
	text,
	label,
	value,
	height = 24,
	onClick,
	titleProps,
	textProps,
	valueProps,
	children,
	suffix,
	buttons,
	style,
}: RowFieldProps) => {
	return (
		<StyledRow
			className={clsx('row', className)}
			direction={'column'}
			justify={'center'}
			onClick={() => onClick?.()}
			height={children ? 'auto' : height}
			gap={4}
			style={style}
		>
			<Flex className='main-row' direction={'row'}>
				{title && (
					<Flex flex={4} fullWidth={false} gap={4}>
						<Flex fullWidth={false} gap={2}>
							<Text className='row-title' text={title} {...titleProps} />
							{suffix?.title && <Text className='row-title-suffix' text={suffix?.title} />}
						</Flex>
						{label && <Text className='label' text={`[${label}]`} />}
					</Flex>
				)}

				{text !== undefined && (
					<Flex flex={2} fullWidth={false} className={clsx('row-text', type)} gap={2} justify={'end'}>
						<Text size='xs' text={text} {...textProps} />
						{suffix?.text && <Text size='xs' className='row-text-suffix' text={suffix?.text} />}
					</Flex>
				)}

				{value !== undefined && (
					<Flex flex={3} fullWidth={false} className={clsx('row-value', type)} justify={'end'} gap={2}>
						<Text text={value} {...valueProps} />
						{suffix?.value && <Text className='row-value-suffix' text={suffix?.value} />}
					</Flex>
				)}

				{buttons && <Flex fullWidth={false}>{buttons}</Flex>}
			</Flex>

			{children && (
				<Flex className='sub-row' direction={'row'}>
					{children}
				</Flex>
			)}
		</StyledRow>
	);
};
