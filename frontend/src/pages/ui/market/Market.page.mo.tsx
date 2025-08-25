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
import { MarketItemType, MarketSearchResponse } from '@features/market/api/market.dto';
import { useMarketHook } from '@features/market/hook/Market.hook';
import { Text } from '@entites/Text';
import { withCommas } from '@shared/libs/utils.lib';
import { Chip } from '@entites/Chip';
import { SearchFieldForm } from '@entites/SearchFieldForm';
import { useForm } from 'react-hook-form';

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
		padding: '0 10px',

		'.box': {
			// border: '1px solid $gray500',
			padding: '0px 10px',
			borderRadius: 4,

			'.row': {},
		},
	},
});

export const MarketPageMo = ({
	viewType = 'kospi',
	data,
	onClick,
}: {
	viewType: 'kospi' | 'kosdaq';
	data?: MarketSearchResponse;
	onClick?: (eid?: string, item?: MarketItemType) => void;
}) => {
	const { navigate } = useCommonHook();
	const { list, totalCount, moreMax, setSearch } = useMarketHook(data, viewType);

	const formMethod = useForm();

	const search = formMethod?.watch('searchtext');
	useEffect(() => {
		setSearch(search);
	}, [search]);

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.MARKET}/${viewType === 'kospi' ? 'kosdaq' : 'kospi'}`;
		},
	});

	const onClickNavi = (eid?: string) => {
		eid && navigate(`${URL.MARKET}/${eid}`);
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

					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 데이터 */}
						<Flex className={clsx('box', swipeClass)} direction={'column'}>
							{list?.map((item) => {
								return (
									<Flex key={item?.code} className='row' height={28}>
										<Text text={item.name} flex={1} textAlign={'left'} />
										{item.mtime && <Chip size='xsmall' label={item.mtime} color='primary' />}
										<Text text={item.code} flex={1} textAlign={'right'} />
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
