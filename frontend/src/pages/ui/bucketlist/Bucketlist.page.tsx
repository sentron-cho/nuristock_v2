import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { BucketlistPageMo } from './Bucketlist.page.mo';
import { useEffect, useMemo, useState } from 'react';
import { PopupType } from '@entites/Dialog';
import { EID } from '@shared/config/default.config';
import { BucketlistRegister as RegisterPopup } from '@features/bucketlist/ui/BucketlistRegister.popup';
import { BucklistCreateType, BucklistParamType } from '@features/bucketlist/api/bucketlist.dto';
import { useDeleteBucket, useSelectBucket } from '@features/bucketlist/api/bucketlist.api';
import { reverse, sortBy } from 'lodash';
import { ST } from '@shared/config/kor.lang';
import { URL } from '@shared/config/url.enum';
import dayjs from 'dayjs';

const BucketlistPage = () => {
	const { isMobile, showToast, showConfirm, navigate, param } = useCommonHook();
	const [popup, setPopup] = useState<PopupType>();
	const [refresh, setRefresh] = useState<number>();

	const { data, refetch } = useSelectBucket();
	const { mutateAsync: deleteData } = useDeleteBucket();

	useEffect(() => {
		if (!data) return;

		if (!param?.id) {
			const items = data?.value?.map((a) => JSON.parse(a.svalue)) as BucklistCreateType[];
			const item = reverse(sortBy(items, ['startYear']))?.find(a => Number(a.startYear) <= dayjs().year());
			navigate(`${URL.BUCKET}/${Number(item?.page)|| 1}`)
		}
	}, [data, param?.id])

	const values = useMemo(() => {
		const items = data?.value?.map((a) => JSON.parse(a.svalue)) as BucklistCreateType[];
		return sortBy(items, ['page']);
	}, [data]);

	const nextPage = useMemo(() => {
		const page = reverse(sortBy(values, ['page']))?.[0]?.page;
		return Number(page || 0) + 1;
	}, [values]);

	const onClick = (eid?: string, item?: BucklistParamType) => {
		if (eid === EID.ADD) {
			setPopup({
				type: eid,
				item: { page: nextPage },
				onClose: (isOk) => {
					isOk && setRefresh(new Date().valueOf());
					setPopup(undefined);
					refetch();
				},
			});
		} else if (eid === EID.EDIT) {
			setPopup({
				type: eid,
				item: item,
				onClose: (isOk) => {
					isOk && setRefresh(new Date().valueOf());
					setPopup(undefined);
					refetch();
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					console.log({ delete: item });
					if (isOk && item?.rowid) {
						await deleteData({ rowid: item.rowid });
						navigate(`${URL.BUCKET}/${Number(item?.page) - 1 || 1}`);
						refetch();
						showToast('info', ST.DELETEED);
						// isOk && setRefresh(new Date().valueOf());
					}
				},
			});
		}
	};

	return (
		<>
			{isMobile && <BucketlistPageMo data={data} refresh={refresh} onClick={onClick} />}
			{!isMobile && <BucketlistPageMo data={data} refresh={refresh} onClick={onClick} />}

			{popup?.type && <RegisterPopup item={popup?.item as BucklistParamType} onClose={popup.onClose} />}
		</>
	);
};

BucketlistPage.displayName = 'BucketlistPage';
export default BucketlistPage;
