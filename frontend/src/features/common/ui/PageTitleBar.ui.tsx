import { Button, ButtonProps } from '@entites/Button';
import Flex from '@entites/Flex';
import { IconButton } from '@entites/IconButton';
import { SelectForm, SelectFormProps } from '@entites/SelectForm';
import { Title } from '@entites/Title';
import { styled } from '@styles/stitches.config';
import { ReactNode } from 'react';

const StyledFlex = styled(Flex, {
	position: 'sticky',
	top: 0,
	zIndex: '$pageTitleBar',
	padding: '0',
	margin: 0,

	'.box': {
		position: 'relative',
		backgroundColor: '$bgcolor',
		borderBottom: '1px solid $gray700',
		// boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2)',
		padding: '$8',
		minHeight: '44px',
		// marginTop: '$4',

		'.left': {
			position: 'absolute',
			left: 4,
		},

		'.right': {
			position: 'absolute',
			right: 4,
		},

		'.icon-button': {
			padding: 8,
		},

		'.plus': {
			color: '$plus',
		},

		'.minus': {
			color: '$minus',
		},
	},
});

interface PageTitleBarProps {
	title?: string;
	titleProps?: {
		className?: string;
	};
	selectProps?: SelectFormProps;
	buttonProps?: ButtonProps;
	children?: ReactNode;
	onClick?: () => void
}

export const PageTitleBar: React.FC<PageTitleBarProps> = ({
	title,
	buttonProps,
	selectProps,
	titleProps,
	children,
	onClick
}) => {
	return (
		<StyledFlex className='page-titl-bar'>
			<Flex className='box' justify={'center'}>
				{title && <Title title={title} className={titleProps?.className || ''} onClick={onClick} />}
				{children && (
					<Flex width={'140px'} className='title'>
						{children}
					</Flex>
				)}
				{selectProps && (
					<SelectForm {...selectProps} className={'left'} size='medium' width={selectProps?.width || 140} />
				)}
				{buttonProps && buttonProps?.title && <Button {...buttonProps} className={'right'} size='medium' />}
				{buttonProps && !buttonProps?.title && (
					<IconButton
						eid={buttonProps?.eid}
						icon={buttonProps?.icon}
						onClick={buttonProps?.onClick}
						className={'right icon-button'}
					/>
				)}
			</Flex>
		</StyledFlex>
	);
};
