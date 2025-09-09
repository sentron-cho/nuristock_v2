import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { useEffect } from 'react';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAddPlaylist } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { TitleNavigation } from '@entites/TitleNavigation';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import clsx from 'clsx';
import { Text } from '@entites/Text';
import { toCost, toSemiCost, toShortCostString, withCommas } from '@shared/libs/utils.lib';
import { SearchFieldForm } from '@entites/SearchFieldForm';
import { useForm } from 'react-hook-form';
import { ResearchItemType, ResearchResponse } from '@features/research/api/research.dto';
import { useResearchHook } from '@features/research/hook/Research.hook';
import dayjs from 'dayjs';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { Chip } from '@entites/Chip';

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

	'.list-head': {
		padding: '0 10px',
		background: '$gray400',
		position: 'sticky',
		top: '80px',
		zIndex: 1,

		'.underline': {
			textDecoration: 'underline',
		},

		'.active': {
			color: '$primaryhover',
		},
	},

	'.contents-layer': {
		padding: '0',

		'.box': {
			// border: '1px solid $gray500',
			padding: '0px 10px',
			borderRadius: 4,

			'.row': {
				marginBottom: '4px',
				borderBottom: '1px solid $gray600',
			},
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
	viewType: 'kospi' | 'kosdaq' | 'none';
	data?: ResearchResponse;
	onClick?: (eid?: string, item?: ResearchItemType) => void;
}) => {
	const { navigate, location } = useCommonHook();
	const { naviOptions, list, totalCount, sort, isErrorList, moreMax, setSearch, setSort, onErrorList } =
		useResearchHook(data, viewType);
	const { prev, next } = useNaviByOptions({ options: naviOptions, value: viewType });

	const formMethod = useForm();

	const search = formMethod?.watch('searchtext');

	useEffect(() => {
		setSearch(search);
	}, [search]);

	const { handlerSwipe } = useSwipePage({
		onNextPage: (dir?: 'next' | 'prev') => {
			if (dir === 'prev') {
				return `${URL.RESEARCH}/${prev?.value}`;
			} else {
				return `${URL.RESEARCH}/${next?.value}`;
			}
		},
	});

	const onClickNavi = (eid?: string) => {
		eid && navigate(`${URL.RESEARCH}/${eid}`);
	};

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

	// useEffect(() => {
	// 	const scrollEl = document.querySelector('.scroll-view');
	// 	if (!scrollEl) return;
	// 	scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
	// }, [viewType]);

	const onSelect = (item?: ResearchItemType) => {
		onClick?.(EID.SELECT, item);

		const key = location.pathname;
		const scrollEl = document.querySelector('.scroll-view');
		scrollEl && sessionStorage.setItem(`scroll-position:${key}`, scrollEl.scrollTop.toString());
	};

	const onClickError = () => {
		onErrorList();
	};

	return (
		<>
			<StyledPage>
				<Flex direction={'column'} flex={1} gap={0}>
					<PageTitleBar
						title={ST.MARKET}
						buttonProps={{
							buttonType: 'icon',
							eid: EID.ADD,
							icon: <IconAddPlaylist />,
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
						<Flex className='total' justify={'between'}>
							<Flex fullWidth={false} flex={1}>
								{totalCount && <Text size='xs' text={`${withCommas(list?.length || 0)} / ${withCommas(totalCount)}`} />}
							</Flex>

							<Flex fullWidth={false} flex={1} gap={8} justify={'end'}>
								<Chip
									size='xsmall'
									variant={isErrorList ? 'filled' : 'outlined'}
									label={'ERROR'}
									color='error'
									onClick={onClickError}
								/>
							</Flex>
						</Flex>
					</Flex>

					<Flex className='list-head' direction={'column'} gap={8}>
						<Flex className='th' height={24} align={'end'}>
							<Text
								bold
								className={clsx('underline', { active: sort === 'name' })}
								text={ST.RESEARCH_TABLE.NAME}
								flex={2}
								textAlign={'start'}
								onClick={() => setSort('name')}
							/>
							<Text text={ST.RESEARCH_TABLE.STIME} flex={2} textAlign={'right'} />

							<Text
								bold
								className={clsx('underline', { active: sort === 'roe' })}
								text={ST.RESEARCH_TABLE.SHARE_RATE}
								flex={1}
								textAlign={'right'}
								onClick={() => setSort('roe')}
							/>
							<Text
								bold
								className={clsx('underline', { active: sort === 'sise' })}
								text={ST.RESEARCH_TABLE.SISE}
								flex={2}
								textAlign={'right'}
								onClick={() => setSort('sise')}
							/>
							<Text text={ST.RESEARCH_TABLE.SHARE} flex={2} textAlign={'right'} />
						</Flex>
						<Flex className='th' height={24} align={'start'}>
							<Text text={''} flex={2} textAlign={'center'} />
							<Text text={ST.RESEARCH_TABLE.COUNT} flex={2} textAlign={'right'} />

							<Text text={ST.RESEARCH_TABLE.ROE} flex={1} textAlign={'right'} />
							<Text text={ST.RESEARCH_TABLE.ASSET} flex={2} textAlign={'right'} />
							<Text text={ST.RESEARCH_TABLE.PROFIT} flex={2} textAlign={'right'} />
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
										direction={'column'}
										height={40}
										onClick={() => onSelect(item)}
									>
										<Flex height={20}>
											<Text
												size='xs'
												text={`${item.name}`}
												flex={2}
												textAlign={'left'}
												onClick={() => onClick?.(EID.FIND, item)}
											/>
											<Text
												size='xs'
												text={`${dayjs(item.stime).format('MM/DD HH:mm')}`}
												flex={2}
												textAlign={'right'}
											/>

											<Text
												size='xs'
												className={clsx(item.shareRateType)}
												text={item.sise ? item.shareRate : '-'}
												flex={1}
												textAlign={'right'}
											/>
											<Text
												size='xs'
												className={clsx(item.siseType)}
												text={item.sise ? toCost(item.sise).replace(' ', '') : '-'}
												flex={2}
												textAlign={'right'}
											/>
											<Text
												size='xs'
												className={clsx(item.shareValueType)}
												text={item.sise ? toCost(item.shareValue).replace(' ', '') : '-'}
												flex={2}
												textAlign={'right'}
											/>
										</Flex>

										<Flex height={20}>
											<Text size='xs' text={''} flex={2} textAlign={'left'} onClick={() => onClick?.(EID.FIND, item)} />

											<Text
												size='xs'
												className={clsx(item.countType)}
												text={toSemiCost(item.scount).replace(ST.WON, '')}
												flex={2}
												textAlign={'right'}
											/>

											<Text size='xs' className={clsx(item.roeType)} text={item.roe} flex={1} textAlign={'right'} />
											<Text
												size='xs'
												className={clsx(item.enquityType)}
												text={toShortCostString(item.equity).replace(ST.WON, '')}
												flex={2}
												textAlign={'right'}
											/>
											<Text
												size='xs'
												className={clsx(item.profitType)}
												text={toShortCostString(item.profit).replace(ST.WON, '')}
												flex={2}
												textAlign={'right'}
											/>
										</Flex>
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
