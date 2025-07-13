import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '../layouts/ui/PageLayout.ui';
import DashboardPage from '../pages/ui/Dashboard.page';
import NotFoundPage from '../pages/ui/NotFound.page';
import StockPage from '../pages/ui/Stock.page';
import AboutPage from '../pages/ui/About.page';
import ProfitPage from '../pages/ui/Profit.page';
import MarketPage from '../pages/ui/Market.page';
import InvestmentPage from '../pages/ui/Investment.page';

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
        path: 'stock',
        element: <PageLayout />,
        children: [{ index: true, element: <StockPage /> }],
      },
      {
        path: 'profit',
        element: <PageLayout />,
        children: [{ index: true, element: <ProfitPage /> }],
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
        path: 'about',
        element: <PageLayout />,
        children: [{ index: true, element: <AboutPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
