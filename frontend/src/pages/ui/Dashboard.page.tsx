import { useMemo } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
// import { StatsForm } from '@features/StatsForm.ui';
import { SummaryData } from '../../features/dashboard/model/Dashbord.data';
import { useSelectDashboard } from '@features/dashboard/api/useSelectDashboard.hook';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$10',
	}
});

const DashboardPage = () => {
	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const { data: list } = useSelectDashboard();
	console.log(list);

	return (
		<StyledPage summaryData={summaryData}>
			<div className='contents'>DashboardPage</div>
			<Flex className='card-list'>
				{list?.map((item) => (
					<DashboardCard key={item.code} data={item} />
				))}
			</Flex>
		</StyledPage>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
