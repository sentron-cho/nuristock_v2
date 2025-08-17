import { MainboardResponse } from '@features/main/api/mainboard.dto';
import { useMainboardCardHook } from '@features/main/hook/Mainboard.hook';
import { useMemo, useState } from 'react';

export const useDashboardHeaderHook = (initialData?: MainboardResponse) => {
	const mainboardData = useMainboardCardHook(initialData);

	const [isShowConfig, setShowConfig] = useState<boolean>(false);
	const [isMoreBuy, setMoreBuy] = useState<boolean>(false);
	const [isMoreSonic, setMoreSonic] = useState<boolean>(false);
	const [isShow, setShow] = useState<boolean>(true);

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
	};

	const onClickMoreSonic = () => {
		setMoreSonic((prev) => !prev);
	};

	const onClickShowConfig = () => {
		setShowConfig((prev) => !prev);
	}

	const onClickShow = () => {
		setShow((prev) => !prev);
	}

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
