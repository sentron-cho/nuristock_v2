import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { StatisticPageMo } from './Statistic.page.mo';
import { EID } from '@shared/config/default.config';
import { useSelectStatistic } from '@features/statistic/api/statistic.api';
import { StatisticItemType } from '@features/statistic/api/statistic.dto';

const StatisticPage = () => {
	const { isMobile } = useCommonHook();
	const { data } = useSelectStatistic();

	const onClick = (eid?: string, item?: StatisticItemType) => {
		console.log({ eid, item });
		if (eid === EID.SELECT) {
		}
	};

	return (
		<>
			{isMobile && <StatisticPageMo data={data} onClick={onClick} />}
			{!isMobile && <StatisticPageMo data={data} onClick={onClick} />}
		</>
	);
};

StatisticPage.displayName = 'StatisticPage';
export default StatisticPage;
