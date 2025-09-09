import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import { DashboardItemType, DashboardResponse } from '@features/dashboard/api/dashboard.dto';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAddPlaylist } from '@entites/Icons';
import { useDashboardHook } from '@features/dashboard/hook/Dashboard.hook';
import clsx from 'clsx';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { DashboardHeader } from '@features/dashboard/ui/DashboardHeader.ui';
import { FormProvider, useForm } from 'react-hook-form';
import { CardListWrap } from '@entites/Card';
import { useMemo } from 'react';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',

			'.box': {
				'&.favorit': {
					borderColor: '$orangehover',
					borderWidth: '2px',
				},

				'.position': {
					fill: '$orange',
				},

				'.body': {
					'.trade-info, .keep-info': {
						padding: '8px',
					},

					'.b-item': {
						borderTop: '1px solid $gray300',
						paddingTop: '$10',
					},
				},

				'.foot': {
					'.naver, .daum': {
						'&.naver': {
							backgroundColor: '#00c73c',
						},
						'&.daum': {
							backgroundColor: '#fcce00',
							color: '$black',
						},
					},

					'.sise': {
						textAlign: 'right',

						'.time': {
							color: '$gray600',
						},

						'.icon': {
							position: 'relative',
							marginLeft: '24px',

							svg: {
								left: '-20px',
								position: 'absolute',
								opacity: '0.8',
							},
						},
					},
				},
			},
		},
	},
});

export const DashboardPageMo = ({
	viewType = 'keep',
	data,
	onClick,
}: {
	viewType?: 'keep' | 'trade' | 'nokeep';
	data?: DashboardResponse;
	onClick?: (eid?: string, item?: DashboardItemType) => void;
}) => {
	const { getConfig, summaryData, titleOptions, sort, onChangeSort, sortedKeeps, sortedTrades, sortedNokeeps } =
		useDashboardHook(data);

	const formMethods = useForm({ defaultValues: { more: getConfig('more')?.toString() === 'true' } });
	const formMore = formMethods?.watch('more');

	const list = useMemo(() => {
		switch (viewType) {
			case 'keep':
				return sortedKeeps;
			case 'nokeep':
				return sortedNokeeps;
			case 'trade':
				return sortedTrades;
			default:
				return sortedKeeps;
		}
	}, [viewType, sortedKeeps, sortedNokeeps, sortedTrades]);

	const title = useMemo(() => {
		switch (viewType) {
			case 'keep':
				return ST.KEEP_STOCK;
			case 'nokeep':
				return ST.FAVORIT_KEEP;
			case 'trade':
				return ST.TRADE_LIST;
			default:
				return ST.KEEP_STOCK;
		}
	}, [viewType]);

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.DASHBOARD}/${viewType === 'keep' ? 'trade' : viewType === 'trade' ? 'nokeep' : 'keep'}`;
		},
	});

	return (
		<FormProvider {...formMethods}>
			<StyledPage summaryData={summaryData}>
				{/* 타이틀바 */}
				<Flex direction={'column'} flex={1}>
					<PageTitleBar
						title={title}
						selectProps={{
							options: titleOptions,
							defaultValue: titleOptions?.[0]?.value,
							value: sort,
							onChange: onChangeSort,
							width: 100,
						}}
						buttonProps={{
							buttonType: 'icon',
							eid: EID.ADD,
							icon: <IconAddPlaylist />,
							onClick: onClick,
						}}
					/>

					{/* 컨텐츠 헤더(요약) */}
					<DashboardHeader />

					{/* 컨텐츠 */}
					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe} flex={1}>
						<Flex className={clsx(swipeClass)} direction={'column'} flex={1}>
							<CardListWrap>
								{list?.map((item) => (
									<DashboardCard
										viewType={viewType}
										sortType={sort}
										key={item.code}
										data={item}
										siseData={data?.sise}
										onClick={onClick}
										isFullDisplay={formMore}
									/>
								))}
							</CardListWrap>
						</Flex>
					</Flex>
				</Flex>
			</StyledPage>
		</FormProvider>
	);
};
