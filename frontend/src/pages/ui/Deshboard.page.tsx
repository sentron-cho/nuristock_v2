import React, { type JSX } from 'react';
import { PageContainer } from '../../features/PageContainer.ui';
import { styled } from '@styles/stitches.config';

const StyledPage = styled(PageContainer, {
  '& > div': {
    height: '3000px',
  },
});

const DashboardPage = () => {
  return (
    <StyledPage>
      <div>DashboardPage</div>
    </StyledPage>
  );
};

export default DashboardPage;
