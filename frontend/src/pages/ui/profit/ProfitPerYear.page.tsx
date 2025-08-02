import { ProfitPerYearPagePc } from './ProfitPerYear.page.pc';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ProfitPerYearPageMo } from './ProfitPerYear.page.mo';

const ProfitPerYearPage = () => {
	const { isMobile } = useCommonHook();

	return (
		<>
			{isMobile && <ProfitPerYearPageMo />}
			{!isMobile && <ProfitPerYearPagePc />}
		</>
	);
};

ProfitPerYearPage.displayName = 'ProfitPerYearPage';
export default ProfitPerYearPage;
