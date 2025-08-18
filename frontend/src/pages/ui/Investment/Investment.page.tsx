import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { InvestmentPageMo } from './Investment.page.mo';
import {
	useClearInvestment,
	useDeleteInvestment,
	useSelectInvestment,
	useUpdateInvestmentByNaver,
	// useRefreshInvestment,
	// useCreateInvestment,
	// useUpdateInvestment,
} from '@features/investment/api/investment.api';
import { PopupType } from '@entites/Dialog';
import { useState } from 'react';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { InvestmentItemType } from '@features/investment/api/investment.dto';
import { StockRegisterPopup } from '@features/dashboard/ui/StockRegister.popup';
import { URL } from '@shared/config/url.enum';
import { Loading } from '@entites/Loading';
import { InvestmentUpdaterPopup } from '@features/investment/ui/InvestmentUpdater.popup';
import dayjs from 'dayjs';

const InvestmentPage = () => {
	const { isMobile, showToast, showConfirm, navigate } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();
	const [loading, setLoading] = useState<boolean>(false);

	const { data, refetch } = useSelectInvestment();

	// const { data: list } = useInvestmentHook(data);

	const { mutateAsync: deleteData } = useDeleteInvestment();
	const { mutateAsync: clearData } = useClearInvestment();
	// const { mutateAsync: refreshData } = useRefreshInvestment();
	const { mutateAsync: updateByNaver } = useUpdateInvestmentByNaver();
	// const { mutateAsync: createData } = useCreateInvestment();
	// const { mutateAsync: updateData } = useUpdateInvestment();

	// useEffect(() => {
	// 	refetch();
	// }, []);

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
					if (isOk && item?.code) {
						await deleteData({ code: item.code }); // 종목 전체 데이터 삭제
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

	const onRefresh = (_eid?: string, item?: InvestmentItemType) => {
		showConfirm({
			content: ST.WANT_TO_UPDATE_NAVER,
			onClose: async (isOk) => {
				if (isOk && item?.code) {
					await updateByNaver({ targetYear: dayjs().format('YYYY'), code: item.code });
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

	const onFailure = () => {
		setLoading(false);
	}

	return (
		<>
			{isMobile && <InvestmentPageMo data={data} onClick={onClick} onRefresh={onRefresh} />}
			{!isMobile && <InvestmentPageMo data={data} onClick={onClick} onRefresh={onRefresh} />}

			{/* 종목 추가 팝업 */}
			{popup?.type === EID.ADD && (
				<StockRegisterPopup viewType={'investment'} onClose={popup?.onClose} onSuccess={onSuccess} onFailure={onFailure} />
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
