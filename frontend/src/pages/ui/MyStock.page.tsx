import { useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import {
	MyStockSummaryData as SummaryData,
	MyStockTitleOptions as SelectOptions,
} from '@features/mystock/config/MyStock.data';
import { MyStockKeepType as KeepType, MyStockTreadType as TreadType } from '@features/mystock/api/mystock.dto';
import { useSelectMyStock, useSelectMyStockSise } from '@features/mystock/api/mystock.api';
import { MyStockCard } from '@features/mystock/ui/MyStockCard.ui';
import Flex from '@entites/Flex';
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

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const MyStockPage = () => {
	const navigate = useNavigate();
	const param = useParams();

	const [popup, setPopup] = useState<PopupType & { type: 'buy' | 'sell' }>();
	const [viewType, setViewType] = useState<'keep' | 'trade'>('keep');

	const { data } = useSelectMyStock(param?.id);
	const { data: siseData } = useSelectMyStockSise(param?.id);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

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
	const sise = useMemo(() => siseData?.value, [siseData]);
	const selected = useMemo(() => stocks?.find((a) => a.value === param?.id)?.value, [stocks, param]);
	console.log({ selected, data, keepList, sellList });

	const onClick = (eid?: string, item?: KeepType) => {
		console.log({ eid, item });

		if (eid === EID.SELECT || eid === 'sell') {
			console.log('[sell]');
			viewType === 'keep' &&
				setPopup({
					type: 'sell',
					item,
					onClose: (isOk: boolean) => {
						console.log('[onCloseSell]', { isOk });
						setPopup(undefined);
					},
				});
		} else if (eid === 'buy') {
			console.log('[buy]');
			setPopup({
				type: 'buy',
				item: { ...item, sise: sise?.sise },
				onClose: (isOk: boolean) => {
					console.log('[onCloseBuy]', { isOk });
					setPopup(undefined);
				},
			});
		} else if (eid === EID.EDIT) {
			console.log('[edit]');
		} else if (eid === EID.DELETE) {
			console.log('[delete]');
		} else if (eid === 'calc') {
			console.log('[calc]');
		}
	};

	const onChangeTitleBar = (value: string) => {
		console.log('[onClickTitleBar]', { value });
		setViewType(value as 'keep' | 'trade');
	};

	const onChangeStock = (value: string) => {
		console.log('[onChangeStock]', { value });
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
					<SelectForm
						options={stocks}
						size='medium'
						border={false}
						defaultValue={selected}
						// value={selected}
						onChange={onChangeStock}
					/>
				</PageTitleBar>
				<Flex className='card-list'>
					{viewType === 'keep' &&
						keepList?.map((item) => (
							<MyStockCard viewType={viewType} key={item.rowid} data={item} sise={sise} onClick={onClick} />
						))}
					{viewType === 'trade' &&
						sellList?.map((item) => (
							<MyStockCard viewType={viewType} key={item.rowid} data={item} sise={sise} onClick={onClick} />
						))}
				</Flex>
			</StyledPage>

			{popup?.type === 'buy' && <MyStockBuyPopup item={popup?.item as TreadType} onClose={popup.onClose} />}
			{popup?.type === 'sell' && <MyStockSellPopup item={popup?.item as TreadType} onClose={popup.onClose} />}
		</>
	);
};

MyStockPage.displayName = 'MyStockPage';

export default MyStockPage;
