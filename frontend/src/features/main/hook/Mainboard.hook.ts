import { useMemo } from 'react';
import { MainboardResponse } from '../api/mainboard.dto';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { APP_GROUP } from '@shared/config/default.config';

export const useMainboardHook = (initialData?: MainboardResponse) => {
	const { data: config, getConfig, createConfig, isPending } = useAppConfigHook({ group: APP_GROUP.DASHBOARD });

	const data = useMemo(() => initialData, [initialData]);

	const list = useMemo(
		() => data?.value,
		[data]
	);

	return {
		loaded: !isPending,
		config,
		getConfig,
		createConfig,
		list,
	};
};
