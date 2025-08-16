// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import router from './router/router.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './layouts/ui/ToastProvider.ui';
import { AlertProvider } from '@layouts/ui/AlertProvider.ui';
import { ConfirmProvider } from '@layouts/ui/ConfirmProvider.ui';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App = () => {
	const queryClient = new QueryClient();

	return (
		<ConfirmProvider>
			<AlertProvider>
				<ToastProvider>
					<QueryClientProvider client={queryClient}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<RouterProvider router={router} />
						</LocalizationProvider>
					</QueryClientProvider>
				</ToastProvider>
			</AlertProvider>
		</ConfirmProvider>
	);
};

export default App;
