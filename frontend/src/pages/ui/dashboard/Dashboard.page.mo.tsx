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
import { useSwipeable } from 'react-swipeable';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		paddingBottom: '100px',

		'.slide-page': {
			display: 'none',

			'&.active': {
				display: 'flex',
			},
		},

		'.card-title': {
			position: 'sticky',
			top: 0,
			textAlign: 'center',
			zIndex: 1000,
			lineHeight: '42px',
			backgroundColor: '$bgcolor',
		},

		'.card-list': {
			flexWrap: 'wrap',
			gap: '$0',
		},
	},
});

export const DashboardPageMo = ({
	data,
	onClick,
}: {
	data?: DashboardResponse;
	onClick: (eid?: string, item?: DataType) => void;
}) => {
	const { summaryData, titleOptions, sort, setSort, sortedKeeps, sortedTrades, activePage, setActivePage } = useDashboardHook(data);

	const handlerSwipe = useSwipeable({
		onSwipedLeft: () => {
			const next = Math.min(activePage + 1, 1);
			setActivePage(next);
		},
		onSwipedRight: () => {
			const next = Math.max(activePage - 1, 0);
			setActivePage(next);
		},
		trackMouse: true,
	});

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<Flex direction={'column'}>
					<PageTitleBar
						title={activePage === 0 ? ST.KEEP_STOCK : ST.TRADE_LIST}
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

					<Flex className='contents-layer' direction={'column'} {...handlerSwipe}>
						{/* 보유 종목 */}
						<Flex className={clsx('slide-page', { active: activePage === 0 })} direction={'column'}>
							{/* <Title className='card-title' title={ST.KEEP_STOCK} /> */}
							<Flex className='card-list'>
								{sortedKeeps?.map((item) => (
									<DashboardCard sortType={sort} key={item.code} data={item} siseData={data?.sise} onClick={onClick} />
								))}
							</Flex>
						</Flex>

						{/* 미보유 종목 */}
						<Flex className={clsx('slide-page', { active: activePage === 1 })} direction={'column'}>
							{/* <Title className='card-title' title={ST.TRADE_LIST} /> */}
							<Flex className='card-list'>
								{sortedTrades?.map((item) => (
									<DashboardCard sortType={sort} key={item.code} data={item} siseData={data?.sise} onClick={onClick} />
								))}
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</StyledPage>
		</>
	);
};
