import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { useEffect, useMemo } from 'react';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAdd } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { TitleNavigation } from '@entites/TitleNavigation';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import clsx from 'clsx';
import { Text } from '@entites/Text';
import { toSemiCost, toShortCostString, withCommas } from '@shared/libs/utils.lib';
import { SearchFieldForm } from '@entites/SearchFieldForm';
import { useForm } from 'react-hook-form';
import { ResearchItemType, ResearchResponse } from '@features/research/api/research.dto';
import { useResearchHook } from '@features/research/hook/Research.hook';

const StyledPage = styled(PageContainer, {
	background: '$white',

	'.head': {
		position: 'sticky',
		top: 84,
		padding: '10px',
		paddingBottom: '0',
		background: '$bgcolor',
		zIndex: 1,

		'.total': {
			paddingTop: 10,
			paddingBottom: 8,
			color: '$gray700',
		},
	},

	'.contents-layer': {
		padding: '0',

		'.box': {
			// border: '1px solid $gray500',
			padding: '0px 10px',
			borderRadius: 4,

			'.row': {},
		},

		'.minus': {
			color: '$minus',
		},
		'.plus': {
			color: '$plus',
		},
	},
});

export const ResearchPageMo = ({
	viewType = 'kospi',
	data,
	onClick,
}: {
	viewType: 'kospi' | 'kosdaq';
	data?: ResearchResponse;
	onClick?: (eid?: string, item?: ResearchItemType) => void;
}) => {
	const { navigate } = useCommonHook();
	const { list, totalCount, moreMax, setSearch } = useResearchHook(data, viewType);

	const formMethod = useForm();

	const search = formMethod?.watch('searchtext');
	useEffect(() => {
		setSearch(search);
	}, [search]);

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.RESEARCH}/${viewType === 'kospi' ? 'kosdaq' : 'kospi'}`;
		},
	});

	const onClickNavi = (eid?: string) => {
		eid && navigate(`${URL.RESEARCH}/${eid}`);
	};

	const naviOptions = useMemo(
		() => [
			{ label: ST.KOSPI, value: 'kospi' },
			{ label: ST.KOSDAQ, value: 'kosdaq' },
		],
		[]
	);

	useEffect(() => {
		const scrollEl = document.querySelector('.scroll-view');
		if (!scrollEl) return;

		const onScroll = () => {
			const { scrollTop, clientHeight, scrollHeight } = scrollEl;
			const nearBottom = scrollTop + clientHeight >= scrollHeight * 0.9;
			nearBottom && moreMax();
		};

		scrollEl.addEventListener('scroll', onScroll);

		return () => scrollEl.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const scrollEl = document.querySelector('.scroll-view');
		if (!scrollEl) return;
		scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
	}, [viewType]);

	return (
		<>
			<StyledPage>
				<Flex direction={'column'}>
					<PageTitleBar
						title={ST.MARKET}
						buttonProps={{
							eid: EID.ADD,
							icon: <IconAdd />,
							title: ST.ADD,
							onClick: onClick,
						}}
					/>

					{/* 제목 */}
					<TitleNavigation sticky stickyTop={44} options={naviOptions} value={viewType} onClick={onClickNavi} />

					{/* 검색 */}
					<Flex className='head' direction={'column'}>
						<Flex className='search-box'>
							{/* <Text text={ST.CLOSE_STOCK}/> */}
							<SearchFieldForm id='searchtext' placeholder={ST.INPUT_SEARCH} formMethod={formMethod} />
						</Flex>
						<Flex className='total' justify={'start'}>
							{/* <Text size='xs' text={'TOTAL : '} /> */}
							{totalCount && <Text size='xs' text={`${withCommas(list?.length || 0)} / ${withCommas(totalCount)}`} />}
						</Flex>
					</Flex>

					<Flex className='th' height={28}>
						<Text text={ST.RESEARCH_TABLE.NAME} flex={2} textAlign={'center'} />
						<Text text={ST.RESEARCH_TABLE.COUNT} flex={2} textAlign={'center'} />
						<Text text={ST.RESEARCH_TABLE.ROE} flex={1} textAlign={'center'} />
						<Text text={ST.RESEARCH_TABLE.ASSET} flex={2} textAlign={'center'} />
						<Text text={ST.RESEARCH_TABLE.PROFIT} flex={2} textAlign={'center'} />
					</Flex>

					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 데이터 */}
						<Flex className={clsx('box', swipeClass)} direction={'column'}>
							{list?.map((item) => {
								return (
									<Flex key={item?.code} className='row' height={28} onClick={() => onClick?.(EID.SELECT, item)}>
										{/* <Text size='xs' text={`${item.name}(${item.code})`} flex={3} textAlign={'left'} /> */}
										<Text size='xs' text={`${item.name}`} flex={2} textAlign={'left'} />
										<Text size='xs' className={clsx(item.countType)} text={toSemiCost(item.scount).replace(ST.WON, ST.JU)} flex={2} textAlign={'right'} />
										<Text size='xs' className={clsx(item.roeType)} text={item.roe} flex={1} textAlign={'right'} />
										<Text size='xs' className={clsx(item.enquityType)} text={toShortCostString(item.equity)} flex={2} textAlign={'right'} />
										<Text size='xs' className={clsx(item.profitType)} text={toShortCostString(item.profit)} flex={2} textAlign={'right'} />
										{/* <IconButton icon={<IconRefresh />} onClick={() => onClickRefresh(item?.code)} /> */}
									</Flex>
								);
							})}
						</Flex>
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
