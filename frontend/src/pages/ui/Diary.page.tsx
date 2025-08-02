import Flex from '@entites/Flex';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { CalendarView } from '@features/diary/ui/CalendarView.ui';
import { ContentsView } from '@features/diary/ui/ContentsView.ui';
import { styled } from '@styles/stitches.config';

const StyledPage = styled(PageContainer, {
	padding: '16px',
	backgroundColor: '#111',
	color: '#fff',
	minHeight: '100vh',
});

const DiaryPage = () => {
	return (
		<StyledPage>
			<Flex className='view-box' direction={'column'} gap={2}>
				<CalendarView />
				<ContentsView />
			</Flex>
		</StyledPage>
	);
};

DiaryPage.displayName = 'DiaryPage';

export default DiaryPage;
