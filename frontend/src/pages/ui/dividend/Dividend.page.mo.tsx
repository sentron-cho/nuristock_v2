import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import { useMemo } from 'react';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAddPlaylist } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { DividendItemType as DataType, DividendResponse } from '@features/dividend/api/dividend.dto';
import { DividendList } from '@features/dividend/ui/DividendCard.ui';
import { useDividendData } from '@features/dividend/hook/Dividend.hook';
import { sortedByKey } from '@shared/libs/sort.lib';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { TitleNavigation } from '@entites/TitleNavigation';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import clsx from 'clsx';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card-title': {
			position: 'sticky',
			top: 0,
			textAlign: 'center',
			zIndex: '$cardTitle',
			lineHeight: '34px',
			backgroundColor: '$bgcolor',
			padding: '4px',

			'&.trade': {
				color: '$black',
			},
		},

		'.card-list': {
			flexWrap: 'wrap',
			gap: '$0',
		},

		'.content-trade': {
			'.trade-layer': {
				paddingBottom: '100px',
			},
		},
	},
});

export const DividendPageMo = ({
	viewType = 'year',
	data,
	onClick,
}: {
	viewType: 'year' | 'code';
	data?: DividendResponse;
	onClick?: (eid?: string, item?: DataType) => void;
}) => {
	const { navigate } = useCommonHook();
	const { data: list, summary, createSumData, groupedByYear, groupedByName } = useDividendData(data);

	const parsed = useMemo(() => {
		if (viewType === 'year') {
			const items = createSumData(list, 'year');
			const titleList = items && sortedByKey(Object.values(items), 'title', true);
			return { titleList, dataList: groupedByYear };
		} else {
			const items = createSumData(list, 'name');
			const titleList = items && sortedByKey(Object.values(items), 'price', true);
			return { titleList, dataList: groupedByName };
		}
	}, [data, viewType]);

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.DIVIDEND}/${viewType === 'year' ? 'code' : 'year'}`;
		},
	});

	const onClickNavi = (eid?: string) => {
		eid && navigate(`${URL.DIVIDEND}/${eid}`);
	};

	const naviOptions = useMemo(
		() => [
			{ label: ST.PER_YEARS, value: 'year' },
			{ label: ST.PER_CODES, value: 'code' },
		],
		[]
	);

	return (
		<>
			<StyledPage summaryData={summary}>
				<Flex direction={'column'}>
					<PageTitleBar
						title={ST.DIVIDEND_HISTORY}
						buttonProps={{
							buttonType: 'icon',
							eid: EID.ADD,
							icon: <IconAddPlaylist />,
							onClick: onClick,
						}}
					/>

					{/* 제목 */}
					<TitleNavigation sticky options={naviOptions} value={viewType} onClick={onClickNavi} />

					<Flex className='contents-layer' direction={'column'} {...handlerSwipe}>
						{/* 년도별 배당금액 */}
						{!!parsed?.titleList?.length && (
							<Flex direction={'column'} className={clsx(swipeClass)}>
								<DividendList
									viewType={viewType}
									head={parsed?.titleList}
									list={parsed?.dataList}
									onClick={onClick}
									onClickItem={onClick}
								/>
							</Flex>
						)}
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
