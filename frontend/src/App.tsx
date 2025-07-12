// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router/router.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
	const queryClient = new QueryClient();

	const mode = import.meta.env.MODE;
	const url = import.meta.env.BASE_URL;
	const api = import.meta.env.VITE_API_URL;
	const isProd = import.meta.env.PROD;

	console.log('[App]', { mode, isProd, url, api });

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
};

export default App;
