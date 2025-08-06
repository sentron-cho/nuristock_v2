import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '../layouts/ui/PageLayout.ui';
import DashboardPage from '../pages/ui/dashboard/Dashboard.page';
import NotFoundPage from '../pages/ui/common/NotFound.page';
import MarketPage from '../pages/ui/Market.page';
import InvestmentPage from '../pages/ui/Investment.page';
import DividendPage from '@page/ui/Dividend.page';
import DiaryPage from '@page/ui/diary/Diary.page';
import ProfitPage from '../pages/ui/profit/Profit.page';
import ProfitPerCodePage from '@page/ui/profit/ProfitPerCode.page';
import ProfitPerYearPage from '../pages/ui/profit/ProfitPerYear.page';
import MyStockPage from '@page/ui/Mystock/MyStock.page';

const router = createBrowserRouter([
	{
		path: '/',
		// element: <PageLayout />,
		children: [
			{
				index: true,
				element: (
					<PageLayout>
						<DashboardPage viewType={'keep'} />
					</PageLayout>
				),
			},
			{
				path: 'dashboard',
				element: <PageLayout />,
				children: [
					{ index: true, element: <DashboardPage viewType={'keep'} /> },
					{ path: 'keep', element: <DashboardPage viewType={'keep'} /> },
					{ path: 'trade', element: <DashboardPage viewType={'trade'} /> },
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
					{ index: true, element: <ProfitPage /> },
					{ path: 'year', element: <ProfitPerYearPage /> },
					{ path: 'code', element: <ProfitPerCodePage /> },
				],
			},
			{
				path: 'market',
				element: <PageLayout />,
				children: [{ index: true, element: <MarketPage /> }],
			},
			{
				path: 'invest',
				element: <PageLayout />,
				children: [{ index: true, element: <InvestmentPage /> }],
			},
			{
				path: 'dividend',
				element: <PageLayout />,
				children: [{ index: true, element: <DividendPage /> }],
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
]);

export default router;
