import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

const StyledFlex = styled(Flex, {
	'&.contents-header': {
		minHeight: 100,
		width: '100%',
		padding: '$4',
		background: '$bgcolor',
		zIndex: 10,

		'&.sticky': {
			position: 'sticky',
			top: '40px',
		},

		'.box': {
			height: '100%',
			backgroundColor: '$white',
			borderRadius: '$sm',
			border: '1px solid rgba(0,0,0,0.05)',
			boxShadow: 'var(--Paper-shadow);',
			overflow: 'hidden',
			padding: '$4 $10',
		},

		'.plus': {
			color: '$plus',
		},

		'.minus': {
			color: '$minus',
		},
	},
});

interface ContentsHeaderProps {
	sticky?: boolean;
	stickyTop?: number | string;
}

export const ContentsHeader = ({
	children,
	sticky = true,
	stickyTop = 40,
}: ContentsHeaderProps & PropsWithChildren) => {
	return (
		<StyledFlex className={clsx('contents-header', { sticky })} style={{ top: sticky ? stickyTop : 'unset' }}>
			<Flex className='box' align={'start'} direction={'column'}>
				{children}
			</Flex>
		</StyledFlex>
	);
};
