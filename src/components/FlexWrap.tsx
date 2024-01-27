import { styled } from '@stitches/react';

const StyledComponent = styled('div', {
	width: '100%',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',

	variants: {
		align: {
			left: {
				justifyContent: 'flex-start',
			},
			right: {
				justifyContent: 'flex-end',
			},
			center: {
				justifyContent: 'center',
			},
			between: {
				justifyContent: 'space-between',
			},
		},
	},
});

const FlexWrap = ({
	className = '',
	children,
	align = 'between',
}: {
	className?: string;
	children?: React.ReactNode;
	align?: 'left' | 'right' | 'center' | 'between';
}) => {
	return (
		<StyledComponent className={`${className || ''}`} align={align}>
			{children}
		</StyledComponent>
	);
};

export default FlexWrap;
