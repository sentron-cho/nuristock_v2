import { SnackbarProvider } from 'notistack';
import React from 'react';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SnackbarProvider
			maxSnack={3}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			preventDuplicate
		>
			{children}
		</SnackbarProvider>
	);
};
