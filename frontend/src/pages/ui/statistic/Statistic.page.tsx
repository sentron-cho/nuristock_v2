import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { StatisticPageMo } from './Statistic.page.mo';
import { useSelectStatistic } from '@features/statistic/api/statistic.api';

const StatisticPage = () => {
	const { isMobile } = useCommonHook();
	const { data } = useSelectStatistic();

	return (
		<>
			{isMobile && <StatisticPageMo data={data} />}
			{!isMobile && <StatisticPageMo data={data} />}
		</>
	);
};

StatisticPage.displayName = 'StatisticPage';
export default StatisticPage;
