import { styled } from '@stitches/react';
import { PropsWithChildren } from 'react';

const StyledLayer = styled('div', {
	'&.flex-layer': {
		// height: 'calc(100% - 60px)',
		display: 'flex',
		flexFlow: 'column',
	},
});

const FlexLayer = ({
	children,
	className = '',
	titleBarHeight = '60px',
	height = '',
	paddingBottom = '20px',
}: PropsWithChildren<{
	className?: string;
	height?: string;
	titleBarHeight?: string;
	paddingBottom?: string;
}>) => {
	const layerHeight = height || `calc(100% - ${titleBarHeight})`;

	return (
		<StyledLayer
			className={`flex-layer ${className}`}
			style={{ height: layerHeight, paddingBottom: paddingBottom }}
		>
			{children}
		</StyledLayer>
	);
};

export default FlexLayer;
