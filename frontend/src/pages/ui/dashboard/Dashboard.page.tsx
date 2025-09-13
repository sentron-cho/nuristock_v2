import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { DashboardPageMo } from './Dashboard.page.mo';
import {
	DashboardItemType as DataType,
	DashboardSiseItemType as SiseItemType,
} from '@features/dashboard/api/dashboard.dto';
import { EID } from '@shared/config/default.config';
import { URL } from '@shared/config/url.enum';
import { ST } from '@shared/config/kor.lang';
import {
	useDeleteDashboard,
	useSelectDashboard,
	useUpdateDashboardPosition,
} from '@features/dashboard/api/dashboard.api';
import { useState } from 'react';
import { PopupType } from '@entites/Dialog';
import { StockRegisterPopup } from '@features/dashboard/ui/StockRegister.popup';
import { StockUpdaterPopup } from '@features/dashboard/ui/StockUpdater.popup';
import { StockSiseUpdaterPopup } from '@features/dashboard/ui/StockSiseUpdater.popup';
import { MyStockBuyPopup } from '@features/mystock/ui/MyStockBuy.popup';
import { MyStockTreadType } from '@features/mystock/api/mystock.dto';

const DashboardPage = ({ viewType = 'trade' }: { viewType?: 'trade' | 'keep' | 'nokeep' }) => {
	const { isMobile } = useCommonHook();
	const { showToast, showConfirm, navigate } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();

	const { data, refetch } = useSelectDashboard();
	const { mutateAsync: deleteData } = useDeleteDashboard();
	const { mutateAsync: updatePosition } = useUpdateDashboardPosition();

	const onClick = async (eid?: string, item?: DataType) => {
		if (eid === EID.SELECT) {
			if (viewType === 'nokeep') {
				setPopup({
					type: 'buy',
					item: data?.sise?.find((b) => b.code === item?.code),
					onClose: (isOk: boolean) => {
						setPopup(undefined);
						isOk && refetch();
					},
				});
			} else {
				navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
			}
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
		} else if (eid === 'title') {
			navigate(`${URL.INVEST}/${item?.code}`)
		} else if (eid === 'naver') {
			window.open(`${URL.REST.NAVER}?code=${item?.code.replace('A', '')}`);
		} else if (eid === 'daum') {
			window.open(`${URL.REST.DAUM}${item?.code}`);
		} else if (eid === 'fnguide') {
			item?.code && window.open(`${URL.REST.FNGUIDE(item.code)}`);
		} else if (eid === 'position') {
			if (item?.code) {
				await updatePosition({ code: item.code, position: item.position === 'long' ? 'short' : 'long' });
				refetch();
			}
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
			{!isMobile && <DashboardPageMo viewType={viewType} data={data} onClick={onClick} />}

			{/* 종목 추가 팝업 */}
			{popup?.type === EID.ADD && <StockRegisterPopup onClose={popup?.onClose} />}

			{/* 보유종목 수정 팝업 */}
			{popup?.type === EID.EDIT && <StockUpdaterPopup item={popup?.item as DataType} onClose={popup?.onClose} />}

			{/* 매수 팝업 */}
			{popup?.type === 'buy' && <MyStockBuyPopup item={popup?.item as MyStockTreadType} onClose={popup.onClose} />}

			{/* 시세 수정 팝업 */}
			{popup?.type === EID.SISE && (
				<StockSiseUpdaterPopup item={popup?.item as SiseItemType} onClose={popup?.onClose} />
			)}
		</>
	);
};

DashboardPage.displayName = 'DashboardPage';
export default DashboardPage;
