import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import { DashboardItemType, DashboardResponse } from '@features/dashboard/api/dashboard.dto';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { useDashboardHook } from '@features/dashboard/hook/Dashboard.hook';
import clsx from 'clsx';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { DashboardHeader } from '@features/dashboard/ui/DashboardHeader.ui';
import { FormProvider, useForm } from 'react-hook-form';
import { CardListWrap } from '@entites/Card';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',

			'.box': {
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
	viewType?: 'keep' | 'trade';
	data?: DashboardResponse;
	onClick?: (eid?: string, item?: DashboardItemType) => void;
}) => {
	const { getConfig, summaryData, titleOptions, sort, onChangeSort, sortedKeeps, sortedTrades } =
		useDashboardHook(data);

	const formMethods = useForm({ defaultValues: { more: getConfig('more')?.toString() === 'true' } });
	const formMore = formMethods?.watch('more');

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.DASHBOARD}/${viewType === 'keep' ? 'trade' : 'keep'}`;
		},
	});

	return (
		<FormProvider {...formMethods}>
			<StyledPage summaryData={summaryData}>
				{/* 타이틀바 */}
				<Flex direction={'column'}>
					<PageTitleBar
						title={viewType === 'keep' ? ST.KEEP_STOCK : ST.TRADE_LIST}
						selectProps={{
							options: titleOptions,
							defaultValue: titleOptions?.[0]?.value,
							value: sort,
							onChange: onChangeSort,
							width: 100,
						}}
						buttonProps={{
							eid: EID.ADD,
							icon: <IconAdd />,
							title: ST.ADD,
							onClick: onClick,
						}}
					/>

					{/* 컨텐츠 헤더(요약) */}
					<DashboardHeader />

					{/* 컨텐츠 */}
					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 보유 종목 */}
						{viewType === 'keep' && (
							<Flex className={clsx(swipeClass)} direction={'column'}>
								<CardListWrap>
									{sortedKeeps?.map((item) => (
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
						)}

						{/* 미보유 종목 */}
						{viewType === 'trade' && (
							<Flex className={clsx(swipeClass)} direction={'column'}>
								<CardListWrap>
									{sortedTrades?.map((item) => (
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
						)}
					</Flex>
				</Flex>
			</StyledPage>
		</FormProvider>
	);
};
