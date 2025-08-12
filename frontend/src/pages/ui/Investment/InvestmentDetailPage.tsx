import { useCommonHook } from '@shared/hooks/useCommon.hook';
import {
	useDeleteInvestment,
	useRefreshInvestment,
	useSelectInvestmentDetail,
	useSelectInvestmentReport,
	// useSelectInvestment,
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
import { InvestmentDetailPageMo } from './InvestmentDetail.page.mo';

const InvestmentDetailPage = () => {
	const { isMobile } = useCommonHook();

	const { showToast, showConfirm, param } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();

	const { data, refetch } = useSelectInvestmentDetail(param?.id as string);

	const { data: list } = useInvestmentHook(data?.value);

	const { mutateAsync: deleteData } = useDeleteInvestment();
	const { mutateAsync: refreshData } = useRefreshInvestment();
	const { mutateAsync: selectReport } = useSelectInvestmentReport();

	useEffect(() => {
		refetch();
	}, []);

	const onClick = (eid?: string, item?: InvestmentItemType) => {
		if (eid === EID.SELECT) {
			// navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
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
		} else {
			// if (eid) {
			// eid === EID.ADD || eid === EID.EDIT || eid === EID.SISE
			eid &&
				setPopup({
					type: eid,
					item: item,
					onClose: (isOk: boolean) => {
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
				console.log({ item });
				if (isOk && item?.code) {
					await refreshData({ targetYear: eid, code: item.code });
					refetch();
					showToast('info', ST.SUCCESS);
				}
			},
		});
	};

	const onClickReport = async (eid?: string, item?: InvestmentItemType) => {
		console.log('[onClickReport]', { eid, item });
		if (!item) return;

		await selectReport({ targetYear: eid, code: item.code });
		showToast('info', ST.SUCCESS);
	};

	return (
		<>
			{isMobile && (
				<InvestmentDetailPageMo data={list} onClick={onClick} onRefresh={onRefresh} onClickReport={onClickReport} />
			)}
			{!isMobile && (
				<InvestmentDetailPageMo data={list} onClick={onClick} onRefresh={onRefresh} onClickReport={onClickReport} />
			)}

			{/* 종목 추가 팝업 */}
			{popup?.type === EID.ADD && <StockRegisterPopup viewType={'investment'} onClose={popup?.onClose} />}
		</>
	);
};

InvestmentDetailPage.displayName = 'InvestmentDetailPage';
export default InvestmentDetailPage;
