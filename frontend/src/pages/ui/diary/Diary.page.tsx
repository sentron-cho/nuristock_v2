import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { DiaryPageMo } from './Diary.page.mo';

const DiaryPage = () => {
	const { isMobile } = useCommonHook();

	return (
		<>
			{isMobile && <DiaryPageMo />}
			{!isMobile && <DiaryPageMo />}
		</>
	);
};

DiaryPage.displayName = 'DiaryPage';

export default DiaryPage;
