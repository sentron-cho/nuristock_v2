import { useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import {
	MyStockKeepType as KeepType,
	MyStockSellType,
	MyStockTreadType as TreadType,
} from '@features/mystock/api/mystock.dto';
import { useDeleteMyStockBuy, useDeleteMyStockSell, useSelectMyStock } from '@features/mystock/api/mystock.api';
import { MyStcokKeepList, MyStcokTradeList } from '@features/mystock/ui/MyStockCard.ui';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { MyStockBuyPopup } from '@features/mystock/ui/MyStockBuy.popup';
import { MyStockSellPopup } from '@features/mystock/ui/MyStockSell.popup';
import { PopupType } from '@entites/Dialog';
import { URL } from '@shared/config/url.enum';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import Flex from '@entites/Flex';
import { Title } from '@entites/Title';
import { useMyStockHook } from '@features/mystock/hook/MyStock.hook';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useSwipeable } from 'react-swipeable';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.slide-page': {
			display: 'none',

			'&.active': {
				display: 'flex',
			},
		},

		'.card-title': {
			position: 'sticky',
			top: 0,
			textAlign: 'center',
			zIndex: 1000,
			lineHeight: '34px',
			backgroundColor: '$bgcolor',
			padding: '4px',

			'&.trade': {
				color: '$black',
			},
		},

		'.card-list': {
			flexWrap: 'wrap',
			gap: '$0',
		},

		'.content-trade': {
			'.trade-layer': {
				paddingBottom: '100px',
			},
		},
	},
});

const MyStockPage = () => {
	const navigate = useNavigate();
	const param = useParams();
	const { showConfirm } = useCommonHook();

	const [popup, setPopup] = useState<PopupType & { type: PopupType['type'] | 'buy' | 'sell' }>();

	const { data, refetch } = useSelectMyStock(param?.id || '');

	const { activePage, setActivePage, keepList, tradeList, selected, summaryData, stocks } = useMyStockHook(data);

	const { mutateAsync: deleteDataBuy } = useDeleteMyStockBuy();
	const { mutateAsync: deleteDataSell } = useDeleteMyStockSell();

	const handlerSwipe = useSwipeable({
		onSwipedLeft: () => {
			const next = Math.min(activePage + 1, 1);
			setActivePage(next);
		},
		onSwipedRight: () => {
			const next = Math.max(activePage - 1, 0);
			setActivePage(next);
		},
		trackMouse: true,
	});

	const onClickKeep = (eid?: string, item?: KeepType) => {
		if (eid === EID.SELECT || eid === 'sell') {
			setPopup({
				type: 'sell',
				item: { ...item, sise: data?.sise?.sise, mode: 'new' },
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
				type: 'buy',
				item: { ...item, code: data?.value?.code, sise: data?.sise?.sise, mode: 'edit' },
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
						await deleteDataBuy({ rowid: item.rowid, code: item.code });
						refetch();
						// showToast('info', ST.DELETEED);
					}
				},
			});
		}
	};

	const onClickTrade = (eid?: string, item?: KeepType) => {
		if (eid === EID.EDIT) {
			setPopup({
				type: 'sell',
				item: { ...item, code: data?.value?.code, sise: data?.sise?.sise, mode: 'edit' },
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
						await deleteDataSell({ rowid: item.rowid, code: item.code });
						refetch();
					}
				},
			});
		}
	};

	const onChangeStock = (value: string) => {
		navigate(`${URL.MYSTOCK}/${value}`);
	};

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<Flex direction={'column'}>
					<PageTitleBar
						title={activePage === 0 ? ST.KEEP_LIST : ST.TRADE_LIST}
						selectProps={{
							options: stocks,
							value: selected,
							onChange: onChangeStock,
							border: false,
						}}
						buttonProps={{
							eid: 'buy',
							icon: <IconAdd />,
							title: ST.BUY,
							onClick: onClickKeep,
						}}
					/>

					<Flex className='contents-layer' direction={'column'} {...handlerSwipe}>
						<Flex className={clsx('slide-page', { active: activePage === 0 })} direction={'column'}>
							{/* 보유현황 */}
							{!!keepList?.length && (
								<Flex direction={'column'}>
									{/* <Title className='card-title keep' title={ST.KEEP_LIST} /> */}
									<MyStcokKeepList list={keepList} sise={data?.sise} onClick={onClickKeep} />
								</Flex>
							)}
						</Flex>

						<Flex className={clsx('slide-page', { active: activePage === 1 })} direction={'column'}>
							{/* 거래내역 */}
							{!!tradeList?.length && (
								<Flex className='content-trade' direction={'column'}>
									{/* <Title className='card-title trade' title={ST.TRADE_LIST} /> */}
									<MyStcokTradeList list={tradeList} sise={data?.sise} onClick={onClickTrade} />
								</Flex>
							)}
						</Flex>
					</Flex>
				</Flex>
			</StyledPage>

			{/* 매수 팝업 */}
			{popup?.type === 'buy' && <MyStockBuyPopup item={popup?.item as TreadType} onClose={popup.onClose} />}

			{/* 매도 팝업 */}
			{popup?.type === 'sell' && <MyStockSellPopup item={popup?.item as MyStockSellType} onClose={popup.onClose} />}
		</>
	);
};

MyStockPage.displayName = 'MyStockPage';

export default MyStockPage;
