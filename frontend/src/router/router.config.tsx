import { createBrowserRouter } from 'react-router-dom';

import PageLayout from '../layouts/PageLayout';
import DeshboardPage from '../pages/Deshboard.page';
import NotFoundPage from '../pages/NotFound.page';
import StockPage from '../pages/Stock.page';
import AboutPage from '../pages/About.page';
import ProfitPage from '../pages/Profit.page';
import SearchPage from '../pages/Search.page';
import ValuePage from '../pages/Value.page';

const router = createBrowserRouter([
  {
    path: '/',
    // element: <PageLayout />,
    children: [
      {
        index: true,
        element: (
          <PageLayout>
            <DeshboardPage />
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
