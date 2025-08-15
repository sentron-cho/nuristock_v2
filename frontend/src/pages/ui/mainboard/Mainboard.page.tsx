import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { MainboardPageMo } from './Mainboard.page.mo';
import { EID } from '@shared/config/default.config';
import { useSelectMainboard } from '@features/main/api/mainboard.api';
import { MainboardItemType } from '@features/main/api/mainboard.dto';

const MainboardPage = () => {
	const { isMobile } = useCommonHook();
	const { data } = useSelectMainboard();

	const onClick = (eid?: string, item?: MainboardItemType) => {
		console.log({ eid, item });

		if (eid === EID.SELECT) {
			// navigate(`${URL.MYSTOCK}/${viewType}/${item?.code}`);
		} else if (eid) {
			// eid === EID.ADD || eid === EID.EDIT || eid === EID.SISE
		}
	};

	return (
		<>
			{isMobile && <MainboardPageMo data={data} onClick={onClick} />}
			{!isMobile && <MainboardPageMo data={data} onClick={onClick} />}
		</>
	);
};

MainboardPage.displayName = 'MainboardPage';
export default MainboardPage;
