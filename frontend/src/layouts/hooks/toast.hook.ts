import { ST } from '@shared/config/kor.lang';
import { BaseVariant, useSnackbar } from 'notistack';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'deleted' | 'registered' | 'updated' | 'none';

export const useToast = () => {
	const { enqueueSnackbar } = useSnackbar();

	const showToast = (type: ToastType = 'info', message?: string) => {
		if (type === 'deleted') {
			enqueueSnackbar(ST.DELETEED, { variant: 'success' }); // 삭제되었습니다.
		} else if (type === 'registered') {
			enqueueSnackbar(ST.REGISTERED, { variant: 'success' }); // 등록되었습니다.
		} else if (type === 'updated') {
			enqueueSnackbar(ST.UPDATED, { variant: 'success' }); // 저장되었습니다.
		} else if (type === 'error') {
			enqueueSnackbar(ST.FAILUER, { variant: 'error' }); // 오류가 발생했습니다.
		} else if (type === 'success') {
			enqueueSnackbar(ST.SUCCESS, { variant: 'success' }); // 처리되었습니다.
		} else {
			enqueueSnackbar(message, { variant: type as BaseVariant });
		}
	};

	const toast = (type: ToastType = 'info', message?: string) => {
		enqueueSnackbar(message, { variant: type as BaseVariant });
	};

	return {
		// deleted: () => enqueueSnackbar(ST.DELETEED, { variant: 'success' }), // 삭제되었습니다.
		// registered: () => enqueueSnackbar(ST.REGISTERED, { variant: 'success' }), // 등록되었습니다.
		// updated: () => enqueueSnackbar(ST.UPDATED, { variant: 'success' }), // 저장되었습니다.

		success: () => enqueueSnackbar(ST.SUCCESS, { variant: 'success' }), // 처리되었습니다.
		error: () => enqueueSnackbar(ST.FAILUER, { variant: 'error' }), // 오류가 발생했습니다.

		info: (msg: string) => enqueueSnackbar(msg, { variant: 'info' }),
		warning: (msg: string) => enqueueSnackbar(msg, { variant: 'warning' }),
		showToast,
		toast,
	};
};
