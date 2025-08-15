import clsx from 'clsx';
import { styled } from '@styles/stitches.config';
import { useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { SummaryBar, SummaryDataType } from './SummaryBar.ui';
import Flex from '@entites/Flex';
import { IconArrowUp } from '@entites/Icons';
import { useLocation, useNavigationType } from 'react-router-dom';

const StyledContainer = styled('div', {
	boxSizing: 'border-box',
	overflow: 'hidden',
	position: 'relative',
	backgroundColor: '$bgcolor',

	'.scroll-view': {
		overflow: 'hidden',
		overflowY: 'auto',
		// maxWidth: '$pageWidth',
		userSelect: 'none',

		'.contents-wrap': {
			maxWidth: '$pageWidth',
			margin: 'auto',
			height: '100%',

			'.contents-layer': {
				// minHeight: '100vh',
				flex: 1,

				'.card-list': {
					flexWrap: 'wrap',
					gap: '$0',
				},
			},
		},
	},

	'@md': {
		'.scroll-view': {
			padding: '0',
			paddingBottom: '$10',

			'.contents-wrap': {
				'.contents-layer': {
					paddingBottom: '150px',
				},
			},

			'.scroll-top': {
				marginBottom: 44,
			},
		},
	},
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
	isShowScrollTop?: boolean;
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
	isShowScrollTop = true,
	onClickSummary,
	...props
}: PageContainerProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	const [showScrollTop, setShowScrollTop] = useState(false);

	const titleBarHeight = useMemo(() => 40, []);
	const summaryHeight = useMemo(() => (summaryData ? 60 : 0), [summaryData]);

	const navigationType = useNavigationType();
	const location = useLocation();
	// 현재 pathname을 key로 사용
	const key = location.pathname;

	// ✅ 새로고침 여부 판단
	// const isReload = performance?.navigation?.type === 1;

	// ✅ 스크롤 이벤트 감지
	useEffect(() => {
		const scrollEl = scrollRef.current;
		if (!scrollEl) return;

		let timeout: ReturnType<typeof setTimeout> | null = null;

		const onScroll = () => {
			setShowScrollTop(scrollEl.scrollTop > 100);

			if (timeout) {
				clearTimeout(timeout);
			}

			// ⏱ 디바운스로 100ms 후 저장
			timeout = setTimeout(() => {
				sessionStorage.setItem(`scroll-position:${key}`, scrollEl.scrollTop.toString());
			}, 100);
		};

		scrollEl.addEventListener('scroll', onScroll);

		return () => scrollEl.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const key = location.pathname;
		const scrollEl = document.querySelector('.scroll-view');
		const savedY = sessionStorage.getItem(`scroll-position:${key}`);
		if (navigationType === 'POP' && scrollEl && savedY) {
			scrollEl.scrollTo({ top: parseInt(savedY, 10), behavior: 'auto' });
		}
	}, [location, navigationType]);

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
				{isShowScrollTop && showScrollTop && (
					<ScrollTopButton className='scroll-top' fontSize='large' onClick={scrollToTop} />
				)}
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
	zIndex: '$pageContainer',
	color: '$white',
	background: '$primary',
	borderRadius: '100px',
	padding: '4px',

	'&:hover': {
		opacity: 0.8,
	},
});
