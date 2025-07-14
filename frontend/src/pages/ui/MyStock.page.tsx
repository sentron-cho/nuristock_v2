import { useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import {
	MyStockSummaryData as SummaryData,
	MyStockTitleOptions as SelectOptions,
} from '../../features/mystock/config/Mystock.data';
import { MyStockKeepType as DataType } from '@features/mystock/api/mystock.dto';
import { useSelectMyStock, useSelectMyStockSise } from '@features/mystock/api/mystock.api';
import { MyStockCard } from '@features/mystock/ui/MystockCard.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { useParams } from 'react-router-dom';
import { MyStockBuyPopup } from '@features/mystock/ui/MyStockBuy.popup';
import { MyStockSellPopup } from '@features/mystock/ui/MyStockSell.popup';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const MyStockPage = () => {
	const param = useParams();

	const [popup, setPopup] = useState<{ type: 'buy' | 'sell'; item?: DataType; code?: string }>();

	const { data } = useSelectMyStock(param?.id);
	const { data: siseData } = useSelectMyStockSise(param?.id);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const titleOptions = useMemo(() => {
		return SelectOptions();
	}, []);

	const list = useMemo(() => data?.keeps, [data]);
	const sise = useMemo(() => siseData?.value, [siseData]);
	console.log(list);

	const onClick = (eid?: string, item?: DataType) => {
		console.log({ eid, item });

		if (eid === EID.SELECT) {
			setPopup({ type: 'sell', item });
		} else if (eid === EID.EDIT) {
		} else if (eid === EID.DELETE) {
		}
	};

	const onClickTitleBar = () => {
		console.log('[onClickTitleBar]');
		setPopup({ type: 'buy' });
	};

	const onChangeTitleBar = (value: string) => {
		console.log('[onClickTitleBar]', { value });
		setPopup({ type: 'buy', code: param?.id });
	};

	const onCloseBuy = (isOk: boolean) => {
		console.log('[onCloseBuy]', { isOk });
		setPopup(undefined);
	};

	const onCloseSell = (isOk: boolean) => {
		console.log('[onCloseSell]', { isOk });
		setPopup(undefined);
	};

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<PageTitleBar
					title={ST.KEEP_STOCK}
					selectProps={{
						options: titleOptions,
						defaultValue: titleOptions?.[0]?.value,
						onChange: onChangeTitleBar,
					}}
					buttonProps={{
						icon: <IconAdd />,
						title: ST.ADD,
						onClick: onClickTitleBar,
					}}
				/>
				<Flex className='card-list'>
					{list?.map((item) => (
						<MyStockCard key={item.rowid} data={item} sise={sise} onClick={onClick} />
					))}
				</Flex>
			</StyledPage>

			{popup?.type === 'buy' && <MyStockBuyPopup item={popup?.item} onClose={onCloseBuy} />}
			{popup?.type === 'sell' && <MyStockSellPopup item={popup?.item} onClose={onCloseSell} />}
		</>
	);
};

MyStockPage.displayName = 'MyStockPage';

export default MyStockPage;
