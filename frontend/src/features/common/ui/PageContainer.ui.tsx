import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import { useMemo, type ComponentProps, type ReactNode } from 'react';
import { SummaryBar, SummaryDataType } from './SummaryBar.ui';
import Flex from '@entites/Flex';

const StyledContainer = styled('div', {
	boxSizing: 'border-box',
	overflow: 'hidden',
	position: 'relative',
	backgroundColor: '$bgcolor',

	'.scroll-view': {
		paddingBottom: '$10',
		overflow: 'hidden',
		overflowY: 'auto',
		// maxWidth: '$pageWidth',

		'.contents-wrap': {
			maxWidth: '$pageWidth',
			margin: 'auto',
			height: '100%',
		}
	},

	'@md': {
		'.scroll-view': {
			padding: '0',
			paddingBottom: '$10',
		}
	}
	// height: 'calc(100vh - 60px)',
});

type PageContainerProps = ComponentProps<typeof StyledContainer> & {
	padding?: number | string;
	width?: number | string;
	height?: number | string;
	className?: string;
	summaryData?: SummaryDataType[];
	children?: ReactNode;
	value?: string;
	defaultValue?: string;
	onClickSummary?: (item: SummaryDataType) => void
};

export const PageContainer = ({
	width = '100vw',
	height,
	className,
	padding,
	children,
	summaryData,
	value,
	defaultValue,
	onClickSummary,
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
			{summaryData && <SummaryBar value={value} defaultValue={defaultValue} data={summaryData} height={summaryHeight} onClick={onClickSummary}  />}
			<div
				className='scroll-view'
				style={{
					height: `calc(100% - ${summaryHeight}px )`,
				}}
			>
				<Flex direction={'column'} className='contents-wrap' flex={1}>{children}</Flex>
			</div>
		</StyledContainer>
	);
};

PageContainer.displayName = 'PageContainer';
