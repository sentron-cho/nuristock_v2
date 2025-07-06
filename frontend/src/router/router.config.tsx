import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '../layouts/ui/PageLayout.ui';
import DashboardPage from '../pages/ui/Dashboard.page';
import NotFoundPage from '../pages/ui/NotFound.page';
import StockPage from '../pages/ui/Stock.page';
import AboutPage from '../pages/ui/About.page';
import ProfitPage from '../pages/ui/Profit.page';
import SearchPage from '../pages/ui/Search.page';
import ValuePage from '../pages/ui/Value.page';

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
        path: 'search',
        element: <PageLayout />,
        children: [{ index: true, element: <SearchPage /> }],
      },
      {
        path: 'value',
        element: <PageLayout />,
        children: [{ index: true, element: <ValuePage /> }],
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
