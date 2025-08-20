import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import { useDeleteDeposit, useSelectDeposit } from '@features/deposit/api/deposit.api';
import { useDepositHook } from '@features/deposit/hook/Deposit.hook';
import { EID } from '@shared/config/default.config';
import { IconAdd } from '@entites/Icons';
import { useMemo, useState } from 'react';
import { PopupType } from '@entites/Dialog';
import { DepositRegisterPopup as RegisterPopup } from '@features/deposit/ui/DepositRegister.popup';
import { DepositItemType } from '@features/deposit/api/deposit.dto';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { GridList } from '@entites/GridList';
import { GridHeader } from '@features/deposit/config/deposit.data';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card-list': {
			padding: '10px 0',

			'.card': {
				'.box': {
					padding: '4px 10px',
				},
			},
		},
	},
});

const DepositPage = () => {
	const { showConfirm } = useCommonHook();
	const { data, refetch } = useSelectDeposit();
	const { data: list } = useDepositHook(data);
	const { mutateAsync: deleteData } = useDeleteDeposit();

	const header = useMemo(() => {
		return GridHeader({ onClick: (eid, item) => onClick(eid, item) });
	}, []);

	const [popup, setPopup] = useState<PopupType>();

	const onClick = (eid?: string, item?: DepositItemType) => {
		if (eid === EID.ADD) {
			setPopup({
				type: eid,
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.SELECT) {
			setPopup({
				type: EID.EDIT,
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
						await deleteData(item.rowid);
						refetch();
					}
				},
			});
		}
	};

	return (
		<>
			<StyledPage>
				<PageTitleBar
					title={ST.ASSET}
					buttonProps={{
						eid: EID.ADD,
						icon: <IconAdd />,
						title: ST.ADD,
						onClick: onClick,
					}}
				/>

				<Flex className='contents-layer' direction={'column'} flex={1}>
					<GridList header={header} data={list} onClick={(eid, item) => onClick(eid, item as DepositItemType)} />
				</Flex>
			</StyledPage>

			{popup?.type === EID.ADD && <RegisterPopup item={popup?.item as DepositItemType} onClose={popup.onClose} />}

			{popup?.type === EID.EDIT && <RegisterPopup item={popup?.item as DepositItemType} onClose={popup.onClose} />}
		</>
	);
};

DepositPage.displayName = 'DepositPage';
export default DepositPage;
