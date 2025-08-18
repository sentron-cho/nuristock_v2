import { IconClose } from '@entites/Icons';
import { IconButton } from '@mui/material';
import { setEnqueueSnackbar } from '@shared/api/toast.config';
import { closeSnackbar, SnackbarProvider, useSnackbar } from 'notistack';
import React, { useCallback, useEffect } from 'react';

const InnerSnackbarInit = () => {
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		setEnqueueSnackbar(enqueueSnackbar); // 전역 등록
	}, [enqueueSnackbar]);

	return null;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	// 스낵바 각각에 Close 버튼을 추가
	const action = useCallback(
		(snackbarId: string | number) => (
			<IconButton
				size='small'
				aria-label='close'
				color='inherit'
				onClick={() => {
					// 스낵바 수동 닫기
					const snackbar = document.getElementById(`notistack-snackbar`);
					if (snackbar) closeSnackbar(snackbarId);
				}}
			>
				<IconClose fontSize='small' />
			</IconButton>
		),
		[]
	);

	return (
		<SnackbarProvider
			maxSnack={3}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			preventDuplicate
			action={action}
		>
			<InnerSnackbarInit />
			{children}
		</SnackbarProvider>
	);
};
