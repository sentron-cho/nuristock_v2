import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { ResearchPageMo } from './Research.page.mo';
import { useSelectResearch } from '@features/research/api/research.api';
import { ResearchItemType } from '@features/research/api/research.dto';
import { EID } from '@shared/config/default.config';
import { URL } from '@shared/config/url.enum';

const ResearchPage = ({ viewType = 'kospi' }: { viewType?: 'kospi' | 'kosdaq' | 'none' }) => {
	const { isMobile, navigate } = useCommonHook();
	const { data } = useSelectResearch();

	const onClick = (eid?: string, item?: ResearchItemType) => {
		if (eid === EID.FIND) {
			item?.code && window.open(`${URL.REST.NAVER}?code=${item.code.replace('A', '')}`);
		} else if (eid === EID.SELECT) {
			navigate(`${URL.RESEARCH}/${viewType}/${item?.code}`);
		}
	}

	return (
		<>
			{isMobile && <ResearchPageMo data={data} viewType={viewType} onClick={onClick} />}
			{!isMobile && <ResearchPageMo data={data} viewType={viewType} onClick={onClick} />}
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

ResearchPage.displayName = 'ResearchPage';
export default ResearchPage;
