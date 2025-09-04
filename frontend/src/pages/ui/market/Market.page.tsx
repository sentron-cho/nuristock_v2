import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { MarketPageMo } from './Market.page.mo';
import { useSelectMarketSearch } from '@features/market/api/market.api';
import { MarketSearchDataType } from '@features/market/api/market.dto';
import { EID } from '@shared/config/default.config';
import { URL } from '@shared/config/url.enum';
import { useDeleteResearch, useRefreshResearch } from '@features/research/api/research.api';
import { ST } from '@shared/config/kor.lang';
import { Loading } from '@entites/Loading';
import { useState } from 'react';

const MarketPage = ({ viewType = 'kospi' }: { viewType?: 'kospi' | 'kosdaq' }) => {
	const { isMobile, showConfirm, showToast } = useCommonHook();
	const { data, refetch } = useSelectMarketSearch({ all: true });

	const [loading, setLoading] = useState<boolean>(false);

	const { mutateAsync: deleteData } = useDeleteResearch();
	const { mutateAsync: refreshData } = useRefreshResearch();

	const onClick = (eid?: string, item?: MarketSearchDataType) => {
		if (eid === EID.SELECT) {
			window.open(`${URL.REST.NAVER}?code=${item?.code.replace('A', '')}`);
			// navigate(`${URL.RESEARCH}/${viewType}/${item?.code}`);
		} else if (eid === EID.UPDATE) {
			showConfirm({
				content: `${item?.name}(${item?.code}) ${ST.WANT_TO_UPDATE_NAVER}`,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						try {
							setLoading(true);
							const res = await refreshData({ code: item.code, name: item?.name });
							
							if (res?.data?.value === 'success') {
								refetch();
								showToast('info', ST.SUCCESS);
							} else {
								showToast('error', ST.FAILUER);
							}
							setLoading(false);
						} catch (error) {
							
						} finally {
							setLoading(false);
						}
					}
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: `${item?.name}(${item?.code}) ${ST.WANT_TO_DELETE}`,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						await deleteData({ code: item?.code });
						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		}
	};

	return (
		<>
			{isMobile && <MarketPageMo data={data} viewType={viewType} onClick={onClick} />}
			{!isMobile && <MarketPageMo data={data} viewType={viewType} onClick={onClick} />}
			{loading && <Loading />}
			{/* 
			{popup?.type === EID.ADD && (
				<RegisterPopup stocks={data?.stock} item={popup?.item as DataType} onClose={popup.onClose} />
			)}
			{popup?.type === EID.EDIT && (
				<RegisterPopup stocks={data?.stock} item={popup?.item as DataType} onClose={popup.onClose} />
			)} */}
		</>
	);
};

MarketPage.displayName = 'MarketPage';
export default MarketPage;
