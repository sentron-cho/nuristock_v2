// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router/router.config';

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
