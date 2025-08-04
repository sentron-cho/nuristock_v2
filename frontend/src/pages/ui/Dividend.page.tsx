import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../features/common/ui/PageContainer.ui';
import { useMemo, useState } from 'react';
import { useSelectDividend as useSelect } from '@features/dividend/api/dividend.api';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { IconAdd } from '@entites/Icons';
import { ST } from '@shared/config/kor.lang';
import { EID } from '@shared/config/default.config';
import { DividendRegisterPopup as RegisterPopup } from '@features/dividend/ui/DividendRegister.popup';
import { PopupType } from '@entites/Dialog';
import { DividendItemType as DataType } from '@features/dividend/api/dividend.dto';
import { DividendList } from '@features/dividend/ui/DividendCard.ui';
import { useDividendData } from '@features/dividend/hook/Dividend.hook';
import { sortedByKey } from '@shared/libs/sort.lib';

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

	const { data: list, stocks, summary, createSumData, groupedByYear } = useDividendData(data);

	const years = useMemo(() => {
		const items = createSumData(list, 'year');
		return items && sortedByKey(Object.values(items), 'title', true);
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

	const onClickItem = (item?: DataType) => {
		console.log({ item });
		setPopup({
			type: EID.EDIT,
			item: item,
			onClose: (isOk) => {
				isOk && refetch();
				setPopup(undefined);
			},
		});
	};

	return (
		<>
			<StyledPage summaryData={summary}>
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
						{/* 년도별 배당금액 */}
						{!!years?.length && (
							<Flex direction={'column'}>
								<DividendList years={years} list={groupedByYear} onClick={onClick} onClickItem={onClickItem} />
							</Flex>
						)}
					</Flex>
				</Flex>
			</StyledPage>

			{popup?.type === EID.ADD && (
				<RegisterPopup stocks={stocks} item={popup?.item as DataType} onClose={popup.onClose} />
			)}
			{popup?.type === EID.EDIT && (
				<RegisterPopup stocks={stocks} item={popup?.item as DataType} onClose={popup.onClose} />
			)}
		</>
	);
};

DividendPage.displayName = 'DividendPage';
export default DividendPage;
