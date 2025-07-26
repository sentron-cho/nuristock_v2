import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
import {
	DashboardSummaryData as SummaryData,
	DashboardTitleOptions as SelectOptions,
} from '@features/dashboard/config/Dashbord.data';
import {
	DashboardItemType as DataType,
	DashboardSiseItemType as SiseItemType,
} from '@features/dashboard/api/dashboard.dto';
import { useDeleteDashboard, useSelectDashboard } from '@features/dashboard/api/dashboard.api';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { StockRegisterPopup } from '@features/dashboard/ui/StockRegister.popup';
import { URL } from '@shared/config/url.enum';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { useNavigate } from 'react-router-dom';
import { StockUpdaterPopup } from '@features/dashboard/ui/StockUpdater.popup';
import { PopupType } from '@entites/Dialog';
import { sortBy, reverse } from 'lodash';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { StockSiseUpdaterPopup } from '@features/dashboard/ui/StockSiseUpdater.popup';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const DashboardPage = () => {
	const navigate = useNavigate();

	const { showToast, showConfirm } = useCommonHook();

	const [popup, setPopup] = useState<PopupType>();
	const [sort, setSort] = useState<string>();

	const { data, refetch } = useSelectDashboard();
	const { mutateAsync: deleteData } = useDeleteDashboard();

	const titleOptions = useMemo(() => {
		return SelectOptions();
	}, []);

	useEffect(() => {
		refetch();
	}, []);

	useEffect(() => setSort(titleOptions?.[0]?.value), [titleOptions]);

	const list = useMemo(
		() =>
			data?.value?.map((row) => {
				const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;

				const sonic = row.eprice - row.sprice;
				const sonicRate = sonic !== 0 ? (row.eprice / row.sprice) * 100 - 100 : 0;

				return {
					...row,
					sonic: sonic,
					sonicRate: sonicRate,
					sise: siseValue,
					siseSonic: siseValue ? row?.kcount * siseValue - row?.kprice : 0,
				};
			}),
		[data]
	);

	const summaryData = useMemo(() => {
		const captal = (list as DataType[])?.map((a) => a.kprice)?.reduce((a, b) => a + b, 0);
		const sell = data?.sise
			? (list as DataType[])
					?.map((a) => {
						const v = data?.sise?.find((b) => b.code === a.code)?.sise as number;
						return a.kcount * v;
					})
					?.reduce((a, b) => a + b, 0)
			: '';
		const sonic = sell && captal && sell - captal;

		const values: string[] = [captal?.toString() || '', sell?.toString() || '', sonic?.toString() || ''];
		return SummaryData(values);
	}, [list, data]);

	const sortedList = useMemo(() => {
		if (sort === 'keepCost') {
			return reverse(sortBy(list, 'kprice'));
		} else if (sort === 'title') {
			return sortBy(list, 'name');
		} else if (sort === 'sonic') {
			// 손익
			const keeps = list?.filter((a) => a.kcount);
			const rest = list?.filter((a) => !a.kcount);
			return reverse([...sortBy(rest, 'siseSonic'), ...sortBy(keeps, 'siseSonic')]);
		} else if (sort === 'sonicRate') {
			// 손익율
			return reverse(sortBy(list, 'sonicRate'));
		} else if (sort === 'sonicCost') {
			// 손익금액
			return reverse(sortBy(list, 'sonic'));
		} else {
			return list;
		}
	}, [list, sort]);

	const onClick = (eid?: string, item?: DataType) => {
		if (eid === EID.SELECT) {
			navigate(`${URL.MYSTOCK}/${item?.code}`);
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: async (isOk) => {
					if (isOk && item?.code) {
						await deleteData(item.code);
						refetch();
						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === 'naver') {
			window.open(`${URL.REST.NAVER}?code=${item?.code.replace('A', '')}`);
		} else if (eid === 'daum') {
			window.open(`${URL.REST.DAUM}${item?.code}`);
		} else if (eid === 'daily') {
			// actions.go(URL.DAILY, { rowid: data.code });
		} else if (eid) {
			// eid === EID.ADD || eid === EID.EDIT || eid === EID.SISE
			setPopup({
				type: eid,
				item: data?.sise?.find((b) => b.code === item?.code),
				onClose: (isOk: boolean) => {
					setPopup(undefined);
					isOk && refetch();
				},
			});
		}
	};

	return (
		<>
			<StyledPage summaryData={summaryData}>
				<PageTitleBar
					title={ST.KEEP_STOCK}
					selectProps={{
						options: titleOptions,
						defaultValue: titleOptions?.[0]?.value,
						onChange: setSort,
					}}
					buttonProps={{
						eid: EID.ADD,
						icon: <IconAdd />,
						title: ST.ADD,
						onClick: onClick,
					}}
				/>
				<Flex className='card-list'>
					{sortedList?.map((item) => (
						<DashboardCard key={item.code} data={item} siseData={data?.sise} onClick={onClick} />
					))}
				</Flex>
			</StyledPage>

			{/* 종목 추가 팝업 */}
			{popup?.type === EID.ADD && <StockRegisterPopup onClose={popup?.onClose} />}

			{/* 보유종목 수정 팝업 */}
			{popup?.type === EID.EDIT && <StockUpdaterPopup item={popup?.item as DataType} onClose={popup?.onClose} />}

			{/* 시세 수정 팝업 */}
			{popup?.type === EID.SISE && (
				<StockSiseUpdaterPopup item={popup?.item as SiseItemType} onClose={popup?.onClose} />
			)}
		</>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
