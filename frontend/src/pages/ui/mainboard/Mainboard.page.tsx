import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { MainboardPageMo } from './Mainboard.page.mo';
import { useSelectMainboard } from '@features/main/api/mainboard.api';
import { MainboardItemType } from '@features/main/api/mainboard.dto';
import { URL } from '@shared/config/url.enum';
import { ChartDataType } from '@entites/Chart.type';

const MainboardPage = () => {
	const { isMobile, navigate } = useCommonHook();
	const { data } = useSelectMainboard();

	const onClick = (eid?: string, item?: MainboardItemType) => {
		console.log({ eid, item });

		switch (eid) {
			case 'sonicTop':
			case 'sonicBottom':
			case 'latestBuy':
				navigate(`${URL.MYSTOCK}/keep/${item?.code}`);
				break;
			case 'latestSell':
				navigate(`${URL.MYSTOCK}/trade/${item?.code}`);
				break;
		}
	};

	const onClickTitle = (eid?: string) => {
		console.log({ eid });

		switch (eid) {
			case 'sonicTop':
			case 'sonicBottom':
			case 'latestBuy':
				navigate(`${URL.DASHBOARD}/keep`);
				break;
			case 'latestSell':
				navigate(`${URL.DASHBOARD}/trade`);
				break;
		}
	};

	const onClickChart = (eid?: string, value?: ChartDataType) => {
		if (eid === 'legend') {
			navigate(`${URL.MYSTOCK}/keep/${value?.key}`);
		} else if (eid === 'title') {
			navigate(`${URL.DASHBOARD}/keep`);
		}
	};

	return (
		<>
			{isMobile && (
				<MainboardPageMo data={data} onClick={onClick} onClickTitle={onClickTitle} onClickChart={onClickChart} />
			)}
			{!isMobile && (
				<MainboardPageMo data={data} onClick={onClick} onClickTitle={onClickTitle} onClickChart={onClickChart} />
			)}
		</>
	);
};

MainboardPage.displayName = 'MainboardPage';
export default MainboardPage;
