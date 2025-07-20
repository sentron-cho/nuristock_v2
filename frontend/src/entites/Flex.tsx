import type { ComponentProps } from 'react';
import clsx from 'clsx';
import { StyledFlex } from './Flex.style';

// props 타입 추출
type FlexProps = ComponentProps<typeof StyledFlex> & {
	width?: string | number;
	height?: string | number;
	flex?: string | number;
	fullWidth?: boolean;
};

// React.forwardRef로 래핑
const Flex = ({ width, fullWidth = true, height, flex, ...props }: FlexProps) => {
	let innerWidth = width ? width : fullWidth ? '100%' : width;
	return <StyledFlex className={clsx('flex')} {...props} css={{ width: innerWidth, height, flex }} />;
};

Flex.displayName = 'Flex';

export default Flex;
