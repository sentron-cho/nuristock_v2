import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { useMemo } from 'react';
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
import { TextInputForm } from '@entites/TextInputForm';

const StyledPage = styled(PageContainer, {
	background: '$white',

	'.head': {
		position: 'sticky',
		top: 84,
		padding: '10px',
		paddingBottom: '0',
		background: '$bgcolor',

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
	const { list, totalCount } = useMarketHook(data, viewType);

	// console.log({ totalCount, list });

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
						<Flex className='search'>
							{/* <Text text={ST.CLOSE_STOCK}/> */}
							<TextInputForm id='search' placeholder={ST.INPUT_SEARCH} />
						</Flex>
						<Flex className='total' justify={'start'}>
							<Text size='xs' text={'TOTAL : '} />
							<Text size='xs' text={withCommas(totalCount)} />
						</Flex>
					</Flex>

					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 데이터 */}
						<Flex className={clsx('box', swipeClass)} direction={'column'}>
							{list?.map((item) => {
								return (
									<Flex className='row' height={24}>
										<Text text={item.name} flex={1} textAlign={'left'} />
										<Text text={item.code} flex={1} textAlign={'right'} />
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
