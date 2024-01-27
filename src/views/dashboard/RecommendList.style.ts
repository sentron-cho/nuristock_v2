import { styled } from '@stitches/react';

export const StyledRecommend = styled('div', {
	'.layout': {
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		flexWrap: 'nowrap',
		gap: 'calc((100% - (120px * 8)) / 11.85)',

		'& > span': {
			width: '140px',
		},

		'.new, span.thumb': {
			width: '140px',
			height: '120px',
		},
	},

	'.box': {
		position: 'relative',
		'.top-icon': {
			position: 'absolute',
			top: '4px',
			right: '4px',
		},
	},
});
