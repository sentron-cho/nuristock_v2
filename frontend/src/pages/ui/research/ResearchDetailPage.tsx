import { useCommonHook } from '@shared/hooks/useCommon.hook';
import {
	useDeleteResearch,
	useRefreshResearch,
	useSelectResearch,
	useSelectResearchByNaver,
	useSelectResearchDetail,
} from '@features/research/api/research.api';
import { PopupType } from '@entites/Dialog';
import { useEffect, useState } from 'react';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { ResearchInfoReportData, ResearchItemType } from '@features/research/api/research.dto';
import { ResearchDetailPageMo } from './ResearchDetail.page.mo';
import { ResearchUpdaterPopup } from '@features/research/ui/ResearchUpdater.popup';
import dayjs from 'dayjs';
import { useResearchHook } from '@features/research/hook/Research.hook';
import { StockSiseUpdaterPopup } from '@features/dashboard/ui/StockSiseUpdater.popup';
import { MarketSiseDataType } from '@features/market/api/market.dto';
import { Loading } from '@entites/Loading';
import { URL } from '@shared/config/url.enum';

const ResearchDetailPage = ({ viewType = 'kospi' }: { viewType?: 'kospi' | 'kosdaq' | 'none' }) => {
	const { isMobile, navigate } = useCommonHook();

	const { showToast, showAlert, showConfirm, param } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();
	const [loading, setLoading] = useState<boolean>(false);
	const [naverData, setNaverData] = useState<ResearchInfoReportData>();

	const { data: list } = useSelectResearch();
	const { data, refetch } = useSelectResearchDetail(param?.id as string);

	const { allList } = useResearchHook(list, viewType);

	const { mutateAsync: refreshData } = useRefreshResearch();
	const { mutateAsync: selectNaver } = useSelectResearchByNaver();
	const { mutateAsync: deleteData } = useDeleteResearch();

	useEffect(() => {
		param?.id && param?.id !== naverData?.code && setNaverData(undefined);
	}, [param]);

	const getNaverInfo = async (code?: string) => {
		if (naverData) return naverData;

		setLoading(true);
		const values = code ? (await selectNaver(code))?.value : undefined;
		setNaverData(values || {});
		setLoading(false);

		return values;
	};

	const onClick = async (eid?: string, item?: ResearchItemType) => {
		if (eid === EID.SELECT) {
			// navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
		} else if (eid === EID.DELETE) {
			// 전체삭제
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
		} else if (eid === 'sise') {
			const naverInfo = await getNaverInfo(item?.code);
			const updown = naverInfo?.updown || ''; // up, down, steady
			const ecost = naverInfo?.ecost || 0;

			setPopup({
				type: eid,
				item: { ...item, sise: naverInfo?.sise || 0, ecost: updown === 'down' ? ecost * -1 : ecost },
				onClose: (isOk: boolean) => {
					setPopup(undefined);
					isOk && refetch();
				},
			});
		} else if (eid === EID.EDIT) {
			const values = await getNaverInfo(item?.code);

			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					setPopup(undefined);
					isOk && refetch();
				},
			});

			if (values?.type === 'konex') {
				showConfirm({
					content: ST.WANT_TO_DELETE,
					onClose: async (isOk) => {
						if (isOk && item?.code) {
							await deleteData({ code: item?.code });
							showToast('info', ST.DELETEED);

							const nextIndex = allList?.findIndex((a) => a.code === item?.code) || 0;
							const next = allList?.[nextIndex + 1];
							next && navigate(`${URL.RESEARCH}/${viewType}/${next?.code}`);
							
							setPopup(undefined);
							refetch();
						}
					},
				});
			}
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
				<ResearchUpdaterPopup
					type={'edit'}
					item={popup?.item as ResearchItemType}
					naverData={naverData}
					onClose={popup?.onClose}
				/>
			)}

			{/* 추가 업데이트 팝업 */}
			{popup?.type === EID.ADD && (
				<ResearchUpdaterPopup type={'add'} item={popup?.item as ResearchItemType} onClose={popup?.onClose} />
			)}

			{/* 시세 업데이트 팝업 */}
			{popup?.type === 'sise' && (
				<StockSiseUpdaterPopup item={popup?.item as MarketSiseDataType} onClose={popup?.onClose} />
			)}

			{loading && <Loading />}
		</>
	);
};

ResearchDetailPage.displayName = 'ResearchDetailPage';
export default ResearchDetailPage;
