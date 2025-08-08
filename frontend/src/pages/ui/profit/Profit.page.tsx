import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ProfitPageMo } from './Profit.page.mo';

const ProfitPage = ({ viewType }: { viewType?: 'year' | 'code' }) => {
	const { isMobile } = useCommonHook();

	return (
		<>
			{isMobile && <ProfitPageMo viewType={viewType} />}
			{!isMobile && <ProfitPageMo viewType={viewType} />}
		</>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
