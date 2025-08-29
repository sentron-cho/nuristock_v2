import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '../layouts/ui/PageLayout.ui';
import DashboardPage from '../pages/ui/dashboard/Dashboard.page';
import NotFoundPage from '../pages/ui/common/NotFound.page';
import MarketPage from '../pages/ui/market/Market.page';
import InvestmentPage from '../pages/ui/Investment/Investment.page';
import DividendPage from '@page/ui/dividend/Dividend.page';
import DiaryPage from '@page/ui/diary/Diary.page';
import ProfitPage from '../pages/ui/profit/Profit.page';
import ProfitPerCodePage from '@page/ui/profit/ProfitPerCode.page';
import ProfitPerYearPage from '../pages/ui/profit/ProfitPerYear.page';
import MyStockPage from '@page/ui/mystock/MyStock.page';
import InvestmentDetailPage from '@page/ui/Investment/InvestmentDetailPage';
import MenuPage from '@page/ui/Menu.page';
import AssetPage from '@page/ui/asset/Asset.page';
import DepositPage from '@page/ui/deposit/Deposit.page';
import MainboardPage from '@page/ui/mainboard/Mainboard.page';
import BucketlistPage from '@page/ui/bucketlist/Bucketlist.page';
import ProfitPerDayPage from '@page/ui/profit/ProfitPerDay.page';
import ResearchPage from '@page/ui/research/Research.page';

const router = createBrowserRouter([
	{
		path: '/',
		// element: <PageLayout />,
		children: [
			{
				index: true,
				element: (
					<PageLayout>
						<MainboardPage />
					</PageLayout>
				),
			},
			{
				path: 'main',
				element: <PageLayout />,
				children: [{ index: true, element: <MainboardPage /> }],
			},
			{
				path: 'dashboard',
				element: <PageLayout />,
				children: [
					{ index: true, element: <DashboardPage viewType={'keep'} /> },
					{ path: 'keep', element: <DashboardPage viewType={'keep'} /> },
					{ path: 'trade', element: <DashboardPage viewType={'trade'} /> },
					{ path: 'nokeep', element: <DashboardPage viewType={'nokeep'} /> },
				],
			},
			{
				path: 'mystock',
				element: <PageLayout />,
				children: [
					{ path: ':id', element: <MyStockPage viewType={'keep'} /> },
					{ path: 'keep/:id', element: <MyStockPage viewType={'keep'} /> },
					{ path: 'trade/:id', element: <MyStockPage viewType={'trade'} /> },
				],
			},
			{
				path: 'diary',
				element: <PageLayout />,
				children: [{ index: true, element: <DiaryPage /> }],
			},
			{
				path: 'profit',
				element: <PageLayout />,
				children: [
					{ index: true, element: <ProfitPage viewType={'year'} /> },
					{ path: 'year', element: <ProfitPage viewType={'year'} /> },
					{ path: 'code', element: <ProfitPage viewType={'code'} /> },
					{ path: 'year/:id', element: <ProfitPerYearPage /> },
					{ path: 'code/:id', element: <ProfitPerCodePage /> },
					{ path: 'day/:id', element: <ProfitPerDayPage /> },
				],
			},
			{
				path: 'market',
				element: <PageLayout />,
				children: [
					{ index: true, element: <MarketPage viewType='kospi' /> },
					{ path: 'kospi', element: <MarketPage viewType='kospi' /> },
					{ path: 'kosdaq', element: <MarketPage viewType='kosdaq' /> }
				],
			},
			{
				path: 'invest',
				element: <PageLayout />,
				children: [
					{ index: true, element: <InvestmentPage viewType={'keep'} /> },
					{ path: 'keep', element: <InvestmentPage viewType={'keep'} /> },
					{ path: 'trade', element: <InvestmentPage viewType={'trade'} /> },
					{ path: 'nokeep', element: <InvestmentPage viewType={'nokeep'} /> },

					{ path: ':id', element: <InvestmentDetailPage /> },
				],
			},
			{
				path: 'dividend',
				element: <PageLayout />,
				children: [
					{ index: true, element: <DividendPage viewType={'year'} /> },
					{ path: 'year', element: <DividendPage viewType={'year'} /> },
					{ path: 'code', element: <DividendPage viewType={'code'} /> },
				],
			},
			{
				path: 'asset',
				element: <PageLayout />,
				children: [{ index: true, element: <AssetPage /> }],
			},
			{
				path: 'deposit',
				element: <PageLayout />,
				children: [{ index: true, element: <DepositPage /> }],
			},
			{
				path: 'menus',
				element: <PageLayout />,
				children: [{ index: true, element: <MenuPage /> }],
			},
			{
				path: 'bucket',
				element: <PageLayout />,
				children: [
					{ index: true, element: <BucketlistPage /> },
					{ path: ':id', element: <BucketlistPage /> },
				],
			},
			{
				path: 'research',
				element: <PageLayout />,
				children: [
					{ index: true, element: <ResearchPage viewType='kospi' /> },
					{ path: 'kospi', element: <ResearchPage viewType='kospi' /> },
					{ path: 'kosdaq', element: <ResearchPage viewType='kosdaq' /> }
				],
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
]);

export default router;
