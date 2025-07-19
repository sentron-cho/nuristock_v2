import { useToast } from '@layouts/hooks/toast.hook';
import { useAlert } from '@layouts/ui/AlertProvider.ui';
import { useConfirm } from '@layouts/ui/ConfirmProvider.ui';
import { z } from 'zod';
import dayjs from 'dayjs';
import { withCommas } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';

export const Schema = {
	DefaultNumber: z.coerce
		.string()
		.refine((v) => !isNaN(Number(withCommas(v, true))), { message: ST.ONLY_NUMBER })
		.min(1, ST.ONLY_NUMBER),
	DefaultDate: z.coerce.string().refine((v) => dayjs(v).isValid(), { message: ST.IN_DATE }),
};

export const useCommonHook = () => {
	const toast = useToast();
	const alert = useAlert();
	const confirm = useConfirm();

	return {
		...toast,
		...alert,
		...confirm,
	};
};
