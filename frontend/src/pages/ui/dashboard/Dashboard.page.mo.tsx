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

const StyledPage = styled(PageContainer, {
	'.contents-layer': {},
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
	const { summaryData, titleOptions, sort, setSort, sortedKeeps, sortedTrades } = useDashboardHook(data);
	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.DASHBOARD}/${viewType === 'keep' ? 'trade' : 'keep'}`;
		},
	});

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<Flex direction={'column'}>
					<PageTitleBar
						title={viewType === 'keep' ? ST.KEEP_STOCK : ST.TRADE_LIST}
						selectProps={{
							options: titleOptions,
							defaultValue: titleOptions?.[0]?.value,
							value: sort,
							onChange: setSort,
							width: 100,
						}}
						buttonProps={{
							eid: EID.ADD,
							icon: <IconAdd />,
							title: ST.ADD,
							onClick: onClick,
						}}
					/>

					<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
						{/* 보유 종목 */}
						{viewType === 'keep' && (
							<Flex className={clsx(swipeClass)} direction={'column'}>
								<Flex className='card-list'>
									{sortedKeeps?.map((item) => (
										<DashboardCard
											sortType={sort}
											key={item.code}
											data={item}
											siseData={data?.sise}
											onClick={onClick}
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
											sortType={sort}
											key={item.code}
											data={item}
											siseData={data?.sise}
											onClick={onClick}
										/>
									))}
								</Flex>
							</Flex>
						)}
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
