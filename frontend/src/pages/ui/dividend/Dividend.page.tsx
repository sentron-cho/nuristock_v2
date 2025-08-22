import { useState } from 'react';
import { useDeleteDividend, useSelectDividend as useSelect } from '@features/dividend/api/dividend.api';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { DividendRegisterPopup as RegisterPopup } from '@features/dividend/ui/DividendRegister.popup';
import { PopupType } from '@entites/Dialog';
import { DividendItemType as DataType } from '@features/dividend/api/dividend.dto';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { DividendPageMo } from './Dividend.page.mo';

const DividendPage = ({ viewType = 'year' }: { viewType?: 'year' | 'code' }) => {
	const { showConfirm, isMobile } = useCommonHook();

	const { data, refetch } = useSelect();
	const { mutateAsync: deleteData } = useDeleteDividend();

	const [popup, setPopup] = useState<PopupType>();

	const onClick = (eid?: string, item?: DataType) => {
		if (eid === EID.ADD) {
			setPopup({
				type: eid,
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.EDIT) {
			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.rowid) {
						await deleteData({ rowid: item.rowid });
						refetch();
					}
				},
			});
		}
	};

	return (
		<>
			{isMobile && <DividendPageMo data={data} onClick={onClick} viewType={viewType} />}
			{!isMobile && <DividendPageMo data={data} onClick={onClick} viewType={viewType} />}

			{popup?.type === EID.ADD && (
				<RegisterPopup stocks={data?.stock} item={popup?.item as DataType} onClose={popup.onClose} />
			)}
			{popup?.type === EID.EDIT && (
				<RegisterPopup stocks={data?.stock} item={popup?.item as DataType} onClose={popup.onClose} />
			)}
		</>
	);
};

DividendPage.displayName = 'DividendPage';
export default DividendPage;
