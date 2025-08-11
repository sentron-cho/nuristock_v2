import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { InvestmentPageMo } from './Investment.page.mo';
import {
	useClearInvestment,
	useDeleteInvestment,
	useRefreshInvestment,
	useSelectInvestment,
	// useCreateInvestment,
	// useUpdateInvestment,
} from '@features/investment/api/investment.api';
import { PopupType } from '@entites/Dialog';
import { useEffect, useState } from 'react';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { InvestmentItemType } from '@features/investment/api/investment.dto';
import { useInvestmentHook } from '@features/investment/hook/Investment.hook';
import { StockRegisterPopup } from '@features/dashboard/ui/StockRegister.popup';
import { URL } from '@shared/config/url.enum';
import { Loading } from '@entites/Loading';
import { InvestmentUpdaterPopup } from '@features/investment/ui/InvestmentUpdater.popup';

const InvestmentPage = () => {
	const { isMobile, showToast, showConfirm, navigate } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();
	const [loading, setLoading] = useState<boolean>(false);

	const { data, refetch } = useSelectInvestment();

	const { data: list } = useInvestmentHook(data?.value);

	const { mutateAsync: deleteData } = useDeleteInvestment();
	const { mutateAsync: clearData } = useClearInvestment();
	const { mutateAsync: refreshData } = useRefreshInvestment();
	// const { mutateAsync: createData } = useCreateInvestment();
	// const { mutateAsync: updateData } = useUpdateInvestment();

	useEffect(() => {
		refetch();
	}, []);

	const onClick = (eid?: string, item?: InvestmentItemType) => {
		if (eid === EID.SELECT) {
			navigate(`${URL.INVEST}/${item?.code}`);
		} else if (eid === EID.CLEAR) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.rowid) {
						await clearData(item.rowid);
						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.rowid) {
						await deleteData(item.rowid);
						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === EID.ADD) {
			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					setPopup(undefined);
					isOk && setLoading(true);
					// isOk && refetch();
				},
			});
		} else if (eid === EID.UPDATE) {
			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					setPopup(undefined);
					isOk && refetch();
				},
			});
		}
	};

	const onRefresh = (eid?: string, item?: InvestmentItemType) => {
		showConfirm({
			content: ST.WANT_TO_REFRESH,
			onClose: async (isOk) => {
				// console.log({ item });
				if (isOk && item?.code) {
					await refreshData({ targetYear: eid, code: item.code });
					refetch();
					showToast('info', ST.SUCCESS);
				}
			},
		});
	};

	const onSuccess = () => {
		setLoading(false);
		refetch();
	};

	return (
		<>
			{isMobile && <InvestmentPageMo data={list} onClick={onClick} onRefresh={onRefresh} />}
			{!isMobile && <InvestmentPageMo data={list} onClick={onClick} onRefresh={onRefresh} />}

			{/* 종목 추가 팝업 */}
			{popup?.type === EID.ADD && (
				<StockRegisterPopup viewType={'investment'} onClose={popup?.onClose} onSuccess={onSuccess} />
			)}

			{/* 설정 업데이트 팝업 */}
			{popup?.type === EID.UPDATE && (
				<InvestmentUpdaterPopup item={popup?.item as InvestmentItemType} onClose={popup?.onClose} />
			)}

			{loading && <Loading />}
		</>
	);
};

InvestmentPage.displayName = 'InvestmentPage';
export default InvestmentPage;
