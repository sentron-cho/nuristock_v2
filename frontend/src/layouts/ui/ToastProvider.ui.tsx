import { setEnqueueSnackbar } from '@shared/api/toast.config';
import { SnackbarProvider, useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

const InnerSnackbarInit = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setEnqueueSnackbar(enqueueSnackbar); // 전역 등록
  }, [enqueueSnackbar]);

  return null;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<SnackbarProvider
			maxSnack={3}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			preventDuplicate
		>
			<InnerSnackbarInit />
			{children}
		</SnackbarProvider>
	);
};
