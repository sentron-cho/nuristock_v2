import { ST } from '@shared/config/kor.lang';
import { useSnackbar } from 'notistack';

export const useToast = () => {
	const { enqueueSnackbar } = useSnackbar();

	const toast = (type: 'success' | 'error' | 'warning' | 'info' = 'info', message?: string) => {
		enqueueSnackbar(message, { variant: type })
	}

	return {
		success: () => enqueueSnackbar(ST.SUCCESS, { variant: 'success' }),
		error: () => enqueueSnackbar(ST.FAILUER, { variant: 'error' }),
		info: (msg: string) => enqueueSnackbar(msg, { variant: 'info' }),
		warning: (msg: string) => enqueueSnackbar(msg, { variant: 'warning' }),
		toast,
	};
};
