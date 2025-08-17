import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { BucketlistPageMo } from './Bucketlist.page.mo';
import { useState } from 'react';
import { PopupType } from '@entites/Dialog';
import { EID } from '@shared/config/default.config';
import { BucketlistRegister as RegisterPopup } from '@features/bucketlist/ui/BucketlistRegister.popup';
import { BucklistParamType } from '@features/bucketlist/api/bucketlist.dto';
import { useSelectBucket } from '@features/bucketlist/api/bucketlist.api';

const BucketlistPage = () => {
	const { isMobile } = useCommonHook();
	const [popup, setPopup] = useState<PopupType>();
	const [refresh, setRefresh] = useState<number>();

	const { data } = useSelectBucket();

	const onClick = (eid?: string, item?: BucklistParamType) => {
		if (eid === EID.SETTING) {
			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					isOk && setRefresh(new Date().valueOf());
					setPopup(undefined);
				},
			});
		}
	};

	return (
		<>
			{isMobile && <BucketlistPageMo data={data} refresh={refresh} onClick={onClick} />}
			{!isMobile && <BucketlistPageMo data={data}  refresh={refresh} onClick={onClick} />}

			{popup?.type && <RegisterPopup item={popup?.item as BucklistParamType} onClose={popup.onClose} />}
		</>
	);
};

BucketlistPage.displayName = 'BucketlistPage';
export default BucketlistPage;
