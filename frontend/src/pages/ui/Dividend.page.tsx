import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import { useMemo, useState } from 'react';
import { useSelectDividend as useSelect } from '@features/dividend/api/dividend.api';
import { DividenSummaryData as SummaryData } from '@features/dividend/config/Dividen.data';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAdd } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { DividendRegisterPopup as RegisterPopup } from '@features/dividend/ui/DividendRegister.popup';
import { PopupType } from '@entites/Dialog';
import { DividendItemType as DataType } from '@features/dividend/api/dividend.dto';
import { DividendList } from '@features/dividend/ui/DividendCard.ui';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
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

const DividendPage = () => {
	const [popup, setPopup] = useState<PopupType>();

	const { data, refetch } = useSelect();

	const list = useMemo(() => data?.value, [data]);
	const stocks = useMemo(() => data?.stock, [data]);

	const summaryData = useMemo(() => {
		return SummaryData();
	}, [data]);

	const onClick = (eid?: string) => {
		console.log({ eid });
		if (eid === EID.ADD) {
			setPopup({
				type: eid,
				onClose: (isOk) => {
					isOk && refetch();
					setPopup(undefined);
				},
			});
		}
	};

	const onClickItem = (eid?: string, item?: DataType) => {
		console.log({ eid, item });
	};

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<Flex direction={'column'}>
					<PageTitleBar
						title={ST.DIVIDEND_HISTORY}
						// selectProps={{
						// 	options: stocks,
						// 	value: selected,
						// 	onChange: onChangeStock,
						// 	border: false,
						// }}
						buttonProps={{
							eid: EID.ADD,
							icon: <IconAdd />,
							title: ST.ADD,
							onClick: onClick,
						}}
					/>

					<Flex className='contents-layer' direction={'column'}>
						{/* 보유현황 */}
						{!!list?.length && (
							<Flex direction={'column'}>
								{/* <Title className='card-title keep' title={ST.KEEP_LIST} /> */}
								<DividendList list={list} onClick={onClickItem} />
							</Flex>
						)}
					</Flex>
				</Flex>
			</StyledPage>

			{popup?.type === 'add' && (
				<RegisterPopup stocks={stocks} item={popup?.item as DataType} onClose={popup.onClose} />
			)}
		</>
	);
};

DividendPage.displayName = 'DividendPage';
export default DividendPage;
