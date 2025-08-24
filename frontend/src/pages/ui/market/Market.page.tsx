import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { MarketPageMo } from './Market.page.mo';
import { useSelectMarketSearch } from '@features/market/api/market.api';

const MarketPage = ({ viewType = 'kospi' }: { viewType?: 'kospi' | 'kosdaq' }) => {
	const { isMobile } = useCommonHook();
	const { data } = useSelectMarketSearch({ all: true });

	return (
		<>
			{isMobile && <MarketPageMo data={data} viewType={viewType} />}
			{!isMobile && <MarketPageMo data={data} viewType={viewType} />}
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
