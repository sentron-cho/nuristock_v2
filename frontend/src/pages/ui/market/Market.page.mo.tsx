import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { useEffect, useMemo } from 'react';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAdd, IconDelete } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { TitleNavigation } from '@entites/TitleNavigation';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import clsx from 'clsx';
import { MarketSearchDataType, MarketSearchResponse } from '@features/market/api/market.dto';
import { useMarketHook } from '@features/market/hook/Market.hook';
import { Text } from '@entites/Text';
import { withCommas } from '@shared/libs/utils.lib';
import { Chip } from '@entites/Chip';
import { SearchFieldForm } from '@entites/SearchFieldForm';
import { useForm } from 'react-hook-form';
import { IconButton } from '@entites/IconButton';

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
	onClick?: (eid?: string, item?: MarketSearchDataType) => void;
}) => {
	const { navigate } = useCommonHook();
	const { list, totalCount, isErrorList, moreMax, setSearch, onErrorList } = useMarketHook(data, viewType);

	const formMethod = useForm();

	const search = formMethod?.watch('searchtext');
	useEffect(() => {
		setSearch(search);
	}, [search]);

	const { handlerSwipe } = useSwipePage({
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

	const onClickError = () => {
		onErrorList();
	};

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
							<SearchFieldForm id='searchtext' placeholder={ST.INPUT_SEARCH} formMethod={formMethod} />
						</Flex>
						<Flex className='total' justify={'between'}>
							{totalCount && <Text size='xs' text={`${withCommas(list?.length || 0)} / ${withCommas(totalCount)}`} />}
							<Chip
								size='xsmall'
								variant={isErrorList ? 'filled' : 'outlined'}
								label={'ERROR'}
								color='error'
								onClick={onClickError}
							/>
						</Flex>
					</Flex>

					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 데이터 */}
						<Flex className={clsx('box')} direction={'column'}>
							{list?.map((item) => {
								return (
									<Flex
										key={item?.code}
										className='row'
										height={40}
										onClick={() => onClick?.(EID.SELECT, item)}
										gap={8}
									>
										<Text text={item.name} flex={1} textAlign={'left'} />
										{item.mtime && (
											<Chip
												variant={Number(item?.mtime) >= 9000 || Number(item?.mtime) === 0 ? 'filled' : 'outlined'}
												size='xsmall'
												label={item.mtime}
												color={Number(item?.mtime) >= 9000 ? 'error' : 'primary'}
											/>
										)}
										<Text text={item.code} flex={1} textAlign={'right'} />
										<IconButton icon={<IconDelete />} onClick={() => onClick?.(EID.DELETE, item)} />
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
