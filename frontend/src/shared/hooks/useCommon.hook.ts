import { useToast } from '@layouts/hooks/toast.hook';
import { useAlert } from '@layouts/ui/AlertProvider.ui';
import { useConfirm } from '@layouts/ui/ConfirmProvider.ui';
import { z } from 'zod';
import dayjs from 'dayjs';
import { withCommas } from '@shared/libs/utils.lib';
import { ST } from '@shared/config/kor.lang';
import { useEffect, useState } from 'react';
import { SCREEN } from '@shared/config/default.config';

const SCREEN_TYPE = {
	MOBILE: 'mobile',
	PC: 'pc',
};

export const Schema = {
	DefaultNumber: z.coerce
		.string()
		.refine((v) => !isNaN(Number(withCommas(v, true))), { message: ST.ONLY_NUMBER })
		.min(1, ST.ONLY_NUMBER),
	DefaultDate: z.coerce.string().refine((v) => dayjs(v).isValid(), { message: ST.IN_DATE }),
};

export const useCommonHook = () => {
	const [screen, setScreen] = useState<string>(SCREEN_TYPE.PC);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			width > SCREEN.MOBILE ? setScreen(SCREEN_TYPE.PC) : setScreen(SCREEN_TYPE.MOBILE);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const toast = useToast();
	const alert = useAlert();
	const confirm = useConfirm();

	return {
		screen,
		isMobile: screen === SCREEN_TYPE.MOBILE,
		isPc: screen === SCREEN_TYPE.PC,
		...toast,
		...alert,
		...confirm,
	};
};
