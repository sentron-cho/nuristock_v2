import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import { useMemo, type ComponentProps, type ReactNode } from 'react';
import { SummaryBar, SummaryDataType } from './SummaryBar.ui';

const StyledContainer = styled('div', {
	boxSizing: 'border-box',
	overflow: 'hidden',
  '.contents-wrap': {
    padding: '$10',
		overflow: 'hidden',
		overflowY: 'auto',
	},
	// height: 'calc(100vh - 60px)',
});

type PageContainerProps = ComponentProps<typeof StyledContainer> & {
	padding?: number | string;
	width?: number | string;
	height?: number | string;
	className?: string;
	summaryData?: SummaryDataType[];
	children?: ReactNode;
};

export const PageContainer = ({
	width = '100vw',
	height,
	className,
	padding,
	children,
	summaryData,
	...props
}: PageContainerProps) => {
	const titleBarHeight = useMemo(() => 40, []);
	const summaryHeight = useMemo(() => (summaryData ? 60 : 0), [summaryData]);

	return (
		<StyledContainer
			className={clsx('page-container', className)}
			css={{
				padding,
				width,
				height: `calc(100% - ${titleBarHeight}px )`,
			}}
			{...props}
		>
			{summaryData && <SummaryBar data={summaryData} height={summaryHeight} />}
			<div
				className='contents-wrap'
				style={{
					height: `calc(100% - ${summaryHeight}px )`,
				}}
			>
				{children}
			</div>
		</StyledContainer>
	);
};

PageContainer.displayName = 'PageContainer';
