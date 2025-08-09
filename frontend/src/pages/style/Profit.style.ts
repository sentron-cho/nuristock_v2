import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';

export const StyledProfitPage = styled(PageContainer, {
	'&.profit': {
		'.view-box': {
			minHeight: 'calc(100vh - 60px - 40px)',
		},

		'.card-title-navi': {
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

			'.button': {
				color: '$gray500',
				position: 'absolute',
				// right: 10,

				'&.left': {
					right: 'unset',
					left: 10,
				},

				'&.right': {
					left: 'unset',
					right: 10,
				},
			},
		},

		'.contents': {
			paddingBottom: '110px',
		},
	},
});
