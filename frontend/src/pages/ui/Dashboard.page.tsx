import React, { useMemo, type JSX } from 'react';
import { PageContainer } from '@features/PageContainer.ui';
import { styled } from '@styles/stitches.config';
// import { StatsForm } from '@features/StatsForm.ui';
import { SummaryData } from '../model/Dashbord.data';

const StyledPage = styled(PageContainer, {
	'.contents': {
		height: '3000px',
	},
});

const DashboardPage = () => {
	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	return (
		<StyledPage summaryData={summaryData}>
			<div className='contents'>DashboardPage</div>
		</StyledPage>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
