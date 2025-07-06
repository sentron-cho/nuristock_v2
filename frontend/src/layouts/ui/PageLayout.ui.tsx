import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.ui';
import { styled } from '@styles/stitches.config';

const StyledLayout = styled('div', {});

const PageLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <StyledLayout className='page'>
      <Header />
      {children || <Outlet />}
    </StyledLayout>
  );
};

export default PageLayout;
