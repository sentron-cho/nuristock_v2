import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useRefreshResearch, useSelectResearch, useSelectResearchDetail } from '@features/research/api/research.api';
import { PopupType } from '@entites/Dialog';
import { useState } from 'react';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { ResearchItemType } from '@features/research/api/research.dto';
import { ResearchDetailPageMo } from './ResearchDetail.page.mo';
import { ResearchUpdaterPopup } from '@features/research/ui/ResearchUpdater.popup';
import dayjs from 'dayjs';
import { useResearchHook } from '@features/research/hook/Research.hook';

const ResearchDetailPage = ({ viewType = 'kospi' }: { viewType?: 'kospi' | 'kosdaq' | 'none' }) => {
	const { isMobile } = useCommonHook();

	const { showToast, showAlert, showConfirm, param } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();

	const { data: list } = useSelectResearch();
	const { data, refetch } = useSelectResearchDetail(param?.id as string);

	const { list: allList } = useResearchHook(list, viewType);

	const { mutateAsync: refreshData } = useRefreshResearch();

	const onClick = (eid?: string, item?: ResearchItemType) => {
		if (eid === EID.SELECT) {
			// navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
		} else if (eid === EID.DELETE) {
			refetch();
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
			{isMobile && <ResearchDetailPageMo data={data} allList={allList} viewType={viewType} onClick={onClick} />}
			{!isMobile && <ResearchDetailPageMo data={data} allList={allList} viewType={viewType} onClick={onClick} />}

			{/* 수정 업데이트 팝업 */}
			{popup?.type === EID.EDIT && (
				<ResearchUpdaterPopup type={'edit'} item={popup?.item as ResearchItemType} onClose={popup?.onClose} />
			)}

			{/* 추가 업데이트 팝업 */}
			{popup?.type === EID.ADD && (
				<ResearchUpdaterPopup type={'add'} item={popup?.item as ResearchItemType} onClose={popup?.onClose} />
			)}
		</>
	);
};

ResearchDetailPage.displayName = 'ResearchDetailPage';
export default ResearchDetailPage;
