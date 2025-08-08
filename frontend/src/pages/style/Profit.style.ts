import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';

export const StyledProfitPage = styled(PageContainer, {
	'&.profit': {
		'.view-box': {
			// paddingBottom: '100px',
			minHeight: '100vh',
			// background: '$gray400',
		},

		'.card-sub-title': {
			width: '100%',
			background: '$bgcolor',
			borderBottom: '1px solid $gray500',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			minHeight: '40px',
			position: 'sticky',
			top: '0px',
			zIndex: 10,
			justifyContent: 'space-between',
			padding: '0 10px',

			'.left, .right': {
				color: '$gray400',
			},
		},

		'.contents-header': {
			position: 'sticky',
			top: '40px',
			background: '$bgcolor',
			zIndex: 10,

			'.plus': {
				color: '$plus',
			},

			'.minus': {
				color: '$minus',
			},
		},
	},
});
