import clsx from 'clsx';
import { styled } from '../styles/stitches.config';
import type { ComponentProps } from 'react';

const StyledContainer = styled('div', {
  boxSizing: 'border-box',
  height: '100vh',
  overflow: 'hidden',
  overflowY: 'auto',
});

type PageContainerProps = ComponentProps<typeof StyledContainer> & {
  padding?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

export const PageContainer = ({ width = '100vw', height, className, padding = 10, ...props }: PageContainerProps) => {
  return <StyledContainer className={clsx('page-container', className)} css={{ padding, width, height }} {...props} />;
};

PageContainer.displayName = 'PageContainer';
