import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ProfitPerCodeMo } from './ProfitPerCode.page.mo';

const ProfitPerCode = () => {
	const { isMobile } = useCommonHook();

	return (
		<>
			{isMobile && <ProfitPerCodeMo />}
			{!isMobile && <ProfitPerCodeMo />}
		</>
	);
};

ProfitPerCode.displayName = 'ProfitPerCode';
export default ProfitPerCode;
