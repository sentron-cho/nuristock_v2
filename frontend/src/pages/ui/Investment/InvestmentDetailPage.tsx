import { useCommonHook } from '@shared/hooks/useCommon.hook';
import {
	useDeleteInvestment,
	useRefreshInvestment,
	useSelectInvestmentDetail,
} from '@features/investment/api/investment.api';
import { PopupType } from '@entites/Dialog';
import { useState } from 'react';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { InvestmentItemType } from '@features/investment/api/investment.dto';
import { InvestmentDetailPageMo } from './InvestmentDetail.page.mo';
import { InvestmentUpdaterPopup } from '@features/investment/ui/InvestmentUpdater.popup';
import dayjs from 'dayjs';

const InvestmentDetailPage = () => {
	const { isMobile } = useCommonHook();

	const { showToast, showAlert, showConfirm, param } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();

	const { data, refetch } = useSelectInvestmentDetail(param?.id as string);

	const { mutateAsync: deleteData } = useDeleteInvestment();
	const { mutateAsync: refreshData } = useRefreshInvestment();

	const onClick = (eid?: string, item?: InvestmentItemType) => {
		if (eid === EID.SELECT) {
			// navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.rowid) {
						await deleteData({ rowid: item.rowid });
						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === EID.ADD) {
			if (item?.sdate === dayjs().format('YYYY')) {
				showAlert({ content: `[${item.sdate}] ${ST.EXIST_DATA_INVEST}` });
			} else {
				setPopup({
					type: eid,
					item: { ...item, sdate: dayjs().format('YYYY'), equity: undefined },
					onClose: (isOk) => {
						setPopup(undefined);
						isOk && refetch();
					},
				});
			}
		} else if (eid === EID.EDIT) {
			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					setPopup(undefined);
					isOk && refetch();
				},
			});
		} else if (eid === 'refresh') {
			showConfirm({
				content: ST.WANT_TO_REFRESH,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						await refreshData({ targetYear: item.sdate, code: item.code });
						refetch();
						showToast('info', ST.SUCCESS);
					}
				},
			});
		}
	};

	return (
		<>
			{isMobile && <InvestmentDetailPageMo data={data} onClick={onClick} />}
			{!isMobile && <InvestmentDetailPageMo data={data} onClick={onClick} />}

			{/* 수정 업데이트 팝업 */}
			{popup?.type === EID.EDIT && (
				<InvestmentUpdaterPopup type={'edit'} item={popup?.item as InvestmentItemType} onClose={popup?.onClose} />
			)}

			{/* 추가 업데이트 팝업 */}
			{popup?.type === EID.ADD && (
				<InvestmentUpdaterPopup type={'add'} item={popup?.item as InvestmentItemType} onClose={popup?.onClose} />
			)}
		</>
	);
};

InvestmentDetailPage.displayName = 'InvestmentDetailPage';
export default InvestmentDetailPage;
