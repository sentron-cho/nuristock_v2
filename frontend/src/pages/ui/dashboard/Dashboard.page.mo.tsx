import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import { DashboardResponse, DashboardItemType as DataType } from '@features/dashboard/api/dashboard.dto';
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

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card': {
			cursor: 'pointer',

			'.box': {
				'.body': {
					'.trade-info, .keep-info': {
						'&.trade-info': {
							borderTop: '1px solid $gray300',
						},

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
	onClick: (eid?: string, item?: DataType) => void;
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

					<DashboardHeader />

					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 보유 종목 */}
						{viewType === 'keep' && (
							<Flex className={clsx(swipeClass)} direction={'column'}>
								<Flex className='card-list'>
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
								</Flex>
							</Flex>
						)}

						{/* 미보유 종목 */}
						{viewType === 'trade' && (
							<Flex className={clsx(swipeClass)} direction={'column'}>
								<Flex className='card-list'>
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
								</Flex>
							</Flex>
						)}
					</Flex>
				</Flex>
			</StyledPage>
		</FormProvider>
	);
};
