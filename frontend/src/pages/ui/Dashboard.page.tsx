import { useMemo} from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
// import { StatsForm } from '@features/StatsForm.ui';
import { SummaryData } from '../../features/dashboard/model/Dashbord.data';
import { useSelectDashboard } from '@features/dashboard/api/useSelectDashboard.hook';

const StyledPage = styled(PageContainer, {
	'.contents': {
		height: '3000px',
	},
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
		</StyledPage>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
