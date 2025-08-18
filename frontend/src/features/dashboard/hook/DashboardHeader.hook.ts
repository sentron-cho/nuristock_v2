import { MainboardResponse } from '@features/main/api/mainboard.dto';
import { useMainboardCardHook } from '@features/main/hook/Mainboard.hook';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';
import { useEffect, useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

export const useDashboardHeaderHook = (initialData?: MainboardResponse) => {
	const mainboardData = useMainboardCardHook(initialData);
	const { setLocalStorage, getLocalStorage } = useStorageHook();

	const [isShowConfig, setShowConfig] = useState<boolean>(false);
	const [isMoreBuy, setMoreBuy] = useState<boolean>(false);
	const [isMoreSonic, setMoreSonic] = useState<boolean>(false);
	const [isShow, setShow] = useState<boolean>(true);

	useEffect(() => {
		const initConfig = getLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE) as FieldValues;
		if (initConfig) {
			initConfig?.isMoreBuy !== undefined && setMoreBuy(Boolean(initConfig?.isMoreBuy));
			initConfig?.isMoreSonic !== undefined && setMoreSonic(Boolean(initConfig?.isMoreSonic));
			initConfig?.isShow !== undefined && setShow(Boolean(initConfig?.isShow));
		}
	}, []);

	const buy = useMemo(() => {
		const { latestBuy } = mainboardData;
		if (isMoreBuy) {
			return latestBuy?.slice(0, 5);
		} else {
			return latestBuy?.slice(0, 3);
		}
	}, [isMoreBuy]);

	const sonic = useMemo(() => {
		const { sonicBuyTop } = mainboardData;
		if (isMoreSonic) {
			return sonicBuyTop?.slice(0, 5);
		} else {
			return sonicBuyTop?.slice(0, 3);
		}
	}, [isMoreSonic]);

	const onClickMoreBuy = () => {
		setMoreBuy((prev) => !prev);
		setLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE, { isMoreBuy: !isMoreBuy, isMoreSonic, isShow });
	};

	const onClickMoreSonic = () => {
		setMoreSonic((prev) => !prev);
		setLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE, { isMoreBuy, isMoreSonic: !isMoreSonic, isShow });
	};

	const onClickShowConfig = () => {
		setShowConfig((prev) => !prev);
		// setLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE, { isMoreBuy, isMoreSonic, isShow: !isShow });
	};

	const onClickShow = () => {
		setShow((prev) => !prev);
		setLocalStorage(StorageDataKey.DASHBOARD_CONFIG_MORE, { isMoreBuy, isMoreSonic, isShow: !isShow });
	};

	return {
		...mainboardData,
		buy,
		sonic,
		isMoreBuy,
		isMoreSonic,
		onClickMoreBuy,
		onClickMoreSonic,
		isShowConfig,
		onClickShowConfig,
		isShow,
		onClickShow,
	};
};
