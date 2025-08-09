import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';

export const StyledProfitPage = styled(PageContainer, {
	'&.profit': {
		'.view-box': {
			// paddingBottom: '100px',
			minHeight: 'calc(100vh - 60px - 40px)',
			// flex: 1,
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

		'.contents': {
			paddingBottom: '60px',

			'.contents-header': {
				background: '$bgcolor',
				zIndex: 10,
				position: 'sticky',
				top: '40px',

				'.plus': {
					color: '$plus',
				},

				'.minus': {
					color: '$minus',
				},
			},
		},
	},
});
