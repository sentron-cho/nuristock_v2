import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { MarketPageMo } from './Market.page.mo';
import { useSelectMarketSearch } from '@features/market/api/market.api';
import { MarketSearchDataType } from '@features/market/api/market.dto';
import { EID } from '@shared/config/default.config';
import { URL } from '@shared/config/url.enum';
import { useDeleteResearch } from '@features/research/api/research.api';
import { ST } from '@shared/config/kor.lang';

const MarketPage = ({ viewType = 'kospi' }: { viewType?: 'kospi' | 'kosdaq' }) => {
	const { isMobile, showConfirm, showToast } = useCommonHook();
	const { data, refetch } = useSelectMarketSearch({ all: true });
	const { mutateAsync: deleteData } = useDeleteResearch();

	const onClick = (eid?: string, item?: MarketSearchDataType) => {
		if (eid === EID.SELECT) {
			window.open(`${URL.REST.NAVER}?code=${item?.code.replace('A', '')}`);
			// navigate(`${URL.RESEARCH}/${viewType}/${item?.code}`);
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
