import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import {
	MyStockSummaryData as SummaryData,
	MyStockTitleOptions as SelectOptions,
} from '@features/mystock/config/MyStock.data';
import {
	MyStockKeepType as KeepType,
	MyStockKeepType,
	MyStockSellType,
	MyStockTreadType as TreadType,
} from '@features/mystock/api/mystock.dto';
import { useDeleteMyStockBuy, useDeleteMyStockSell, useSelectMyStock } from '@features/mystock/api/mystock.api';
import { MyStcokCardList } from '@features/mystock/ui/MyStockCard.ui';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { useNavigate, useParams } from 'react-router-dom';
import { MyStockBuyPopup } from '@features/mystock/ui/MyStockBuy.popup';
import { MyStockSellPopup } from '@features/mystock/ui/MyStockSell.popup';
import { PopupType } from '@entites/Dialog';
import { reverse, sortBy } from 'lodash';
import { SelectForm } from '@entites/SelectForm';
import { OptionType } from '@shared/config/common.type';
import { URL } from '@shared/config/url.enum';
import { useCommonHook } from '@shared/hooks/useCommon.hook';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const MyStockPage = () => {
	const navigate = useNavigate();
	const { showToast, showConfirm } = useCommonHook();

	const param = useParams();

	const [popup, setPopup] = useState<PopupType & { type: PopupType['type'] | 'buy' | 'sell' }>();
	const [viewType, setViewType] = useState<'keep' | 'trade'>('keep');

	const { data, refetch } = useSelectMyStock(param?.id || '');
	const { mutateAsync: deleteDataBuy } = useDeleteMyStockBuy();
	const { mutateAsync: deleteDataSell } = useDeleteMyStockSell();

	const titleOptions = useMemo(() => {
		return SelectOptions();
	}, []);

	const keepList = useMemo(() => reverse(sortBy(data?.keeps, 'sdate')), [data]);
	const sellList = useMemo(() => reverse(sortBy(data?.sells, 'edate')), [data]);
	const stocks = useMemo(
		() =>
			sortBy(
				data?.stocks?.map((a) => ({ value: a?.code, label: a?.name }) as OptionType),
				'label'
			),
		[data]
	);
	const selected = useMemo(() => stocks?.find((a) => a.value === param?.id)?.value, [stocks, param]);

	const summaryData = useMemo(() => {
		const buy = (data?.sells as MyStockSellType[])?.map((a) => a.scost * a.count)?.reduce((a, b) => a + b, 0);
		const sell = (data?.sells as MyStockSellType[])?.map((a) => a.ecost * a.count)?.reduce((a, b) => a + b, 0);
		const keep = (data?.keeps as MyStockKeepType[])?.map((a) => a.scost * a.count)?.reduce((a, b) => a + b, 0);
		const sonic = buy && sell && sell - buy;
		const values: string[] = [
			buy?.toString() || '',
			sell?.toString() || '',
			keep?.toString() || '',
			sonic?.toString() || '',
		];
		return SummaryData(values);
	}, [data]);

	const onClick = (eid?: string, item?: KeepType) => {
		if (eid === EID.SELECT || eid === 'sell') {
			viewType === 'keep' &&
				setPopup({
					type: 'sell',
					item: { ...item, sise: data?.sise?.sise },
					onClose: (isOk) => {
						isOk && refetch();
						setPopup(undefined);
					},
				});
		} else if (eid === 'buy') {
			setPopup({
				type: eid,
				item: { code: data?.value?.code, sise: data?.sise?.sise },
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.EDIT) {
			setPopup({
				type: viewType === 'keep' ? 'buy' : 'sell',
				item: { ...item, code: data?.value?.code, sise: data?.sise?.sise },
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						viewType === 'keep' && (await deleteDataBuy({ rowid: item.rowid, code: item.code }));
						viewType === 'trade' && (await deleteDataSell({ rowid: item.rowid, code: item.code }));

						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === 'calc') {
			console.log('[calc]');
		}
	};

	const onChangeTitleBar = (value: string) => {
		setViewType(value as 'keep' | 'trade');
	};

	const onChangeStock = (value: string) => {
		navigate(`${URL.MYSTOCK}/${value}`);
	};

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<PageTitleBar
					selectProps={{
						options: titleOptions,
						defaultValue: titleOptions?.[0]?.value,
						value: viewType,
						onChange: onChangeTitleBar,
					}}
					buttonProps={{
						eid: 'buy',
						icon: <IconAdd />,
						title: ST.BUY,
						onClick: onClick,
					}}
				>
					<SelectForm options={stocks} size='medium' border={false} defaultValue={selected} onChange={onChangeStock} />
				</PageTitleBar>

				<MyStcokCardList
					viewType={viewType}
					list={viewType === 'keep' ? keepList : sellList}
					sise={data?.sise}
					onClick={onClick}
				/>
			</StyledPage>

			{popup?.type === 'buy' && <MyStockBuyPopup item={popup?.item as TreadType} onClose={popup.onClose} />}
			{popup?.type === 'sell' && <MyStockSellPopup item={popup?.item as TreadType} onClose={popup.onClose} />}
		</>
	);
};

MyStockPage.displayName = 'MyStockPage';

export default MyStockPage;
