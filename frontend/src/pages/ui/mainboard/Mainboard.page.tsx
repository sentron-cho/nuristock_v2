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
		switch (eid) {
			case 'latestSell':
				navigate(`${URL.MYSTOCK}/trade/${item?.code}`);
				break;
			default:
				navigate(`${URL.MYSTOCK}/keep/${item?.code}`);
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
				<MainboardPageMo data={data} onClick={onClick} onClickChart={onClickChart} />
			)}
			{!isMobile && (
				<MainboardPageMo data={data} onClick={onClick} onClickChart={onClickChart} />
			)}
		</>
	);
};

MainboardPage.displayName = 'MainboardPage';
export default MainboardPage;
