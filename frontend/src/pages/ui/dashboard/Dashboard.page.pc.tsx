import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import { DashboardResponse, DashboardItemType as DataType } from '@features/dashboard/api/dashboard.dto';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { Title } from '@entites/Title';
import { useDashboardHook } from '@features/dashboard/hook/Dashboard.hook';
import clsx from 'clsx';
import { CardListWrap } from '@entites/Card';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		paddingBottom: '100px',

		'.card-title': {
			position: 'sticky',
			top: 0,
			textAlign: 'center',
			zIndex: '$cardTitle',
			lineHeight: '42px',
			backgroundColor: '$bgcolor',
		},

		'.card-list': {
			flexWrap: 'wrap',
			gap: '$0',
		},
	},
});

export const DashboardPagePc = ({
	viewType = 'trade',
	data,
	onClick,
}: {
	viewType?: 'keep' | 'trade';
	data?: DashboardResponse;
	onClick: (eid?: string, item?: DataType) => void;
}) => {
	const { summaryData, titleOptions, sort, onChangeSort, sortedKeeps, sortedTrades } = useDashboardHook(data);

	return (
		<StyledPage className={clsx(viewType)} summaryData={summaryData}>
			<Flex direction={'column'}>
				<PageTitleBar
					title={ST.KEEP_STOCK}
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

				<Flex className='contents-layer' direction={'column'}>
					{/* 보유 종목 */}
					<Flex direction={'column'}>
						<CardListWrap>
							{sortedKeeps?.map((item) => (
								<DashboardCard sortType={sort} key={item.code} data={item} siseData={data?.sise} onClick={onClick} />
							))}
						</CardListWrap>
					</Flex>

					{/* 미보유 종목 */}
					<Flex direction={'column'}>
						<Title className='card-title' title={ST.TRADE_LIST} />
						<CardListWrap>
							{sortedTrades?.map((item) => (
								<DashboardCard sortType={sort} key={item.code} data={item} siseData={data?.sise} onClick={onClick} />
							))}
						</CardListWrap>
					</Flex>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
