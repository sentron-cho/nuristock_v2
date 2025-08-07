import Flex from '@entites/Flex';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

const StyledFlex = styled(Flex, {
	'&.contents-header': {
		minHeight: 100,
		width: '100%',
		padding: '$4',

		'.box': {
			height: '100%',
			backgroundColor: '$white',
			borderRadius: '$sm',
			border: '1px solid rgba(0,0,0,0.05)',
			boxShadow: 'var(--Paper-shadow);',
      overflow: 'hidden',
      padding: '$10',
		},
	},
});

interface ContentsHeaderProps {}

export const ContentsHeader = ({ children }: ContentsHeaderProps & PropsWithChildren) => {
	return (
		<StyledFlex className={clsx('contents-header')}>
			<Flex className='box' align={'start'}>{children}</Flex>
		</StyledFlex>
	);
};
