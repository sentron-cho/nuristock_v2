import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '../layouts/ui/PageLayout.ui';
import DashboardPage from '../pages/ui/Dashboard.page';
import NotFoundPage from '../pages/ui/common/NotFound.page';
import MarketPage from '../pages/ui/Market.page';
import InvestmentPage from '../pages/ui/Investment.page';
import MyStockPage from '@page/ui/MyStock.page';
import DividendPage from '@page/ui/Dividend.page';
import DiaryPage from '@page/ui/Diary.page';
import ProfitPage from '../pages/ui/profit/Profit.page';
import ProfitPerCodePage from '@page/ui/profit/ProfitPerCode.page';
import ProfitPerYearPage from '../pages/ui/profit/ProfitPerYear.page';

const router = createBrowserRouter([
	{
		path: '/',
		// element: <PageLayout />,
		children: [
			{
				index: true,
				element: (
					<PageLayout>
						<DashboardPage />
					</PageLayout>
				),
			},
			{
				path: 'mystock',
				element: <PageLayout />,
				children: [{ path: ':id', element: <MyStockPage /> }],
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
