import { useState } from 'react';
import {
	MyStockKeepType as KeepType,
	MyStockSellType,
	MyStockTreadType as TreadType,
} from '@features/mystock/api/mystock.dto';
import { useDeleteMyStockBuy, useDeleteMyStockSell, useSelectMyStock } from '@features/mystock/api/mystock.api';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { MyStockBuyPopup } from '@features/mystock/ui/MyStockBuy.popup';
import { MyStockSellPopup } from '@features/mystock/ui/MyStockSell.popup';
import { PopupType } from '@entites/Dialog';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { MyStockPageMo } from './MyStock.page.mo';

const MyStockPage = ({ viewType }: { viewType?: 'keep' | 'trade' }) => {
	const { isMobile } = useCommonHook();
	const { showConfirm, param } = useCommonHook();

	const [popup, setPopup] = useState<PopupType & { type: PopupType['type'] | 'buy' | 'sell' }>();

	const { data, refetch } = useSelectMyStock(param?.id || '');

	const { mutateAsync: deleteDataBuy } = useDeleteMyStockBuy();
	const { mutateAsync: deleteDataSell } = useDeleteMyStockSell();

	// useEffect(() => refetch(), []);

	const onClickKeep = (eid?: string, item?: KeepType) => {
		if (eid === EID.SELECT || eid === 'sell') {
			setPopup({
				type: 'sell',
				item: { ...item, sise: data?.sise?.sise, mode: 'new' },
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === 'buy') {
			setPopup({
				type: eid,
				item: { code: data?.value?.code, sise: data?.sise?.sise },
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.EDIT) {
			setPopup({
				type: 'buy',
				item: { ...item, code: data?.value?.code, sise: data?.sise?.sise, mode: 'edit' },
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						await deleteDataBuy({ rowid: item.rowid, code: item.code });
						refetch();
						// showToast('info', ST.DELETEED);
					}
				},
			});
		}
	};

	const onClickTrade = (eid?: string, item?: KeepType) => {
		if (eid === EID.EDIT) {
			setPopup({
				type: 'sell',
				item: { ...item, code: data?.value?.code, sise: data?.sise?.sise, mode: 'edit' },
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						await deleteDataSell({ rowid: item.rowid, code: item.code });
						refetch();
					}
				},
			});
		}
	};

	return (
		<>
			{isMobile && (
				<MyStockPageMo viewType={viewType} data={data} onClickKeep={onClickKeep} onClickTrade={onClickTrade} />
			)}
			{!isMobile && (
				<MyStockPageMo viewType={viewType} data={data} onClickKeep={onClickKeep} onClickTrade={onClickTrade} />
			)}

			{/* 매수 팝업 */}
			{popup?.type === 'buy' && <MyStockBuyPopup item={popup?.item as TreadType} onClose={popup.onClose} />}

			{/* 매도 팝업 */}
			{popup?.type === 'sell' && <MyStockSellPopup item={popup?.item as MyStockSellType} onClose={popup.onClose} />}
		</>
	);
};

MyStockPage.displayName = 'MyStockPage';

export default MyStockPage;
