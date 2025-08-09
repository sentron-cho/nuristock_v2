import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';

export const StyledProfitPage = styled(PageContainer, {
	'&.profit': {
		'.view-box': {
			minHeight: 'calc(100vh - 60px - 40px)',
		},

		'.contents': {
			paddingBottom: '110px',
		},
	},
});
