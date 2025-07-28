import { ProfitPagePc } from './Profit.page.pc';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ProfitPageMo } from './Profit.page.mo';

const ProfitPage = () => {
	const { isMobile } = useCommonHook();

	return (
		<>
			{isMobile && <ProfitPageMo />}
			{!isMobile && <ProfitPagePc />}
		</>
	);
};

ProfitPage.displayName = 'ProfitPage';
export default ProfitPage;
