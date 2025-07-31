import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { SummaryBar, SummaryDataType } from './SummaryBar.ui';
import Flex from '@entites/Flex';
import { IconArrowUp } from '@entites/Icons';

const StyledContainer = styled('div', {
	boxSizing: 'border-box',
	overflow: 'hidden',
	position: 'relative',
	backgroundColor: '$bgcolor',

	'.scroll-view': {
		overflow: 'hidden',
		overflowY: 'auto',
		// maxWidth: '$pageWidth',

		'.contents-wrap': {
			maxWidth: '$pageWidth',
			margin: 'auto',
			height: '100%',

			'& > *': {
				paddingBottom: '100px',
			},
		},
	},

	'@md': {
		'.scroll-view': {
			padding: '0',
			paddingBottom: '$10',
		},
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
	value?: string;
	defaultValue?: string;
	onClickSummary?: (item: SummaryDataType) => void;
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
	const scrollRef = useRef<HTMLDivElement>(null);

	const [showScrollTop, setShowScrollTop] = useState(false);

	const titleBarHeight = useMemo(() => 40, []);
	const summaryHeight = useMemo(() => (summaryData ? 60 : 0), [summaryData]);

	// ✅ 스크롤 이벤트 감지
	useEffect(() => {
		const scrollEl = scrollRef.current;
		if (!scrollEl) return;

		const onScroll = () => {
			setShowScrollTop(scrollEl.scrollTop > 100);
		};

		scrollEl.addEventListener('scroll', onScroll);
		return () => scrollEl.removeEventListener('scroll', onScroll);
	}, []);

	// ✅ 맨 위로 이동 함수
	const scrollToTop = () => {
		scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
	};

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
			{summaryData && (
				<SummaryBar
					value={value}
					defaultValue={defaultValue}
					data={summaryData}
					height={summaryHeight}
					onClick={onClickSummary}
				/>
			)}
			<div
				ref={scrollRef}
				className='scroll-view'
				style={{
					height: `calc(100% - ${summaryHeight}px )`,
				}}
			>
				<Flex direction={'column'} className='contents-wrap' flex={1}>
					{children}
				</Flex>

				{/* ✅ 스크롤 Top 버튼 */}
				{/* {showScrollTop && <ScrollTopButton onClick={scrollToTop}>↑</ScrollTopButton>} */}
				{showScrollTop && <ScrollTopButton fontSize='large' onClick={scrollToTop} />}
			</div>
		</StyledContainer>
	);
};

PageContainer.displayName = 'PageContainer';

// ✅ 상단 이동 버튼 스타일 정의
const ScrollTopButton = styled(IconArrowUp, {
	position: 'fixed',
	right: '10px',
	bottom: '10px',
	zIndex: 100,
	color: '$white',
	background: '$primary',
	borderRadius: '100px',
	padding: '4px',

	'&:hover': {
		opacity: 0.8,
	},
});
