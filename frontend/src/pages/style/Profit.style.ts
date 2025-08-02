import Flex from '@entites/Flex';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';

export const StyledProfitPage = styled(PageContainer, {
	'&.profit': {
		'.view-box': {
			paddingBottom: '100px',
			// background: '$gray400',
		},

		'.card-sub-title': {
			width: '100%',
			background: '$bgcolor',
			borderBottom: '1px solid $gray500',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			position: 'sticky',
			top: '0px',
			zIndex: 10,
			justifyContent: 'space-between',
			padding: '0 10px',

			'.total,': {
				color: '$gray700',
			},

			'.sum': {
				'&.plus': {
					color: '$plus',
				},

				'&.minus': {
					color: '$minus',
				},
			},
		},
	},
});

