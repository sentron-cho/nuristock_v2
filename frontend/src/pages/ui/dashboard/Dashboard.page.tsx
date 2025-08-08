import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { DashboardPageMo } from './Dashboard.page.mo';
import { DashboardPagePc } from './Dashboard.page.pc';
import {
	DashboardItemType as DataType,
	DashboardSiseItemType as SiseItemType,
} from '@features/dashboard/api/dashboard.dto';
import { EID } from '@shared/config/default.config';
import { URL } from '@shared/config/url.enum';
import { ST } from '@shared/config/kor.lang';
import { useDeleteDashboard, useSelectDashboard } from '@features/dashboard/api/dashboard.api';
import { useEffect, useState } from 'react';
import { PopupType } from '@entites/Dialog';
import { StockRegisterPopup } from '@features/dashboard/ui/StockRegister.popup';
import { StockUpdaterPopup } from '@features/dashboard/ui/StockUpdater.popup';
import { StockSiseUpdaterPopup } from '@features/dashboard/ui/StockSiseUpdater.popup';

const DashboardPage = ({ viewType = 'trade' }: { viewType?: 'trade' | 'keep' }) => {
	const { isMobile } = useCommonHook();
	const { showToast, showConfirm, navigate } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();

	const { data, refetch } = useSelectDashboard();
	const { mutateAsync: deleteData } = useDeleteDashboard();

	useEffect(() => {
		refetch();
	}, []);

	const onClick = (eid?: string, item?: DataType) => {
		if (eid === EID.SELECT) {
			navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						await deleteData(item.code);
						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === 'naver') {
			window.open(`${URL.REST.NAVER}?code=${item?.code.replace('A', '')}`);
		} else if (eid === 'daum') {
			window.open(`${URL.REST.DAUM}${item?.code}`);
		} else if (eid === 'daily') {
			// actions.go(URL.DAILY, { rowid: data.code });
		} else if (eid) {
			// eid === EID.ADD || eid === EID.EDIT || eid === EID.SISE
			setPopup({
				type: eid,
				item: data?.sise?.find((b) => b.code === item?.code),
				onClose: (isOk: boolean) => {
					setPopup(undefined);
					isOk && refetch();
				},
			});
		}
	};

	return (
		<>
			{isMobile && <DashboardPageMo viewType={viewType} data={data} onClick={onClick} />}
			{!isMobile && <DashboardPagePc viewType={viewType} data={data} onClick={onClick} />}

			{/* 종목 추가 팝업 */}
			{popup?.type === EID.ADD && <StockRegisterPopup onClose={popup?.onClose} />}

			{/* 보유종목 수정 팝업 */}
			{popup?.type === EID.EDIT && <StockUpdaterPopup item={popup?.item as DataType} onClose={popup?.onClose} />}

			{/* 시세 수정 팝업 */}
			{popup?.type === EID.SISE && (
				<StockSiseUpdaterPopup item={popup?.item as SiseItemType} onClose={popup?.onClose} />
			)}
		</>
	);
};

DashboardPage.displayName = 'DashboardPage';
export default DashboardPage;
