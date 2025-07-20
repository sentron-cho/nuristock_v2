import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
// import { StatsForm } from '@features/StatsForm.ui';
import {
	DashboardSummaryData as SummaryData,
	DashboardTitleOptions as SelectOptions,
} from '@features/dashboard/config/Dashbord.data';
import {
	DashboardItemType,
	DashboardItemType as DataType,
	// DashboardResponse as ResponseType,
} from '@features/dashboard/api/dashboard.dto';
import { useSelectDashboard } from '@features/dashboard/api/dashboard.api';
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

	const { data } = useSelectDashboard();
	// const { data: siseData } = useSelectDashboardSise();

	const titleOptions = useMemo(() => {
		return SelectOptions();
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
		const captal = (list as DashboardItemType[])?.map(a => a.kprice)?.reduce((a, b) => a + b, 0);
		const sell = data?.sise ? (list as DashboardItemType[])?.map(a => {
			const v = data?.sise?.find(b => b.code === a.code)?.sise as number
			return a.kcount * v;
		})?.reduce((a, b) => a + b, 0) : '';
		const sonic = sell && captal && (sell - captal);

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
			// return reverse([...sortBy(rest, 'sonicRate'), ...sortBy(keeps, 'sonicRate')]);
		} else if (sort === 'sonicCost') {
			// 손익금액
			return reverse(sortBy(list, 'sonic'));
			// return reverse([...sortBy(rest, 'sonic'), ...sortBy(keeps, 'sonic')]);
		} else {
			return list;
		}
	}, [list, sort]);

	const onClick = (eid?: string, item?: DataType) => {
		let data = item;

		if (eid === EID.SELECT) {
			navigate(`${URL.MYSTOCK}/${item?.code}`);
		} else if (eid === EID.ADD) {
			setPopup({
				type: 'insert',
				onClose: (isOk: boolean) => {
					console.log(isOk);
					setPopup(undefined);
				},
			});
		} else if (eid === EID.EDIT) {
			setPopup({
				type: 'update',
				item: item,
				onClose: (isOk: boolean) => {
					console.log(isOk);
					// data != null &&
					// 	actions.doUpdate(API.DASHBOARD, data).then(({ result }) => {
					// 		const array = [...this.state.list];
					// 		const item = array.find((item) => item.stockid === result.rowid);
					// 		if (item) {
					// 			item.name = result.name;
					// 			this.setState({ list: array, update: new Date() });
					// 		}
					// 		// this.doReload(() => this.doLoadSise());
					// 	});
					setPopup(undefined);
				},
			});
		} else if (eid === EID.DELETE) {
			showConfirm({
				content: ST.WANT_TO_DELETE,
				onClose: (isOk) => {
					if (isOk) {
						// 	const value = { state: STAT.D, rowid: String(data.stockid) };
						// 	actions.doDelete(API.DASHBOARD, value).then(({ code, result }) => {
						// 		this.setState({ alert: { show: true, code: code, key: new Date() } });
						// 		this.doReload();
						// 	});

						showToast('info', ST.DELETEED);
					}
				},
			});
		} else if (eid === 'naver') {
			window.open(`${URL.REST.NAVER}?code=${data?.code.replace('A', '')}`);
		} else if (eid === 'daum') {
			window.open(`${URL.REST.DAUM}${data?.code}`);
		} else if (eid === 'daily') {
			// actions.go(URL.DAILY, { rowid: data.code });
		}
	};

	// if(isPending) return 'Loading...'

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

			{popup?.type === EID.INSERT && <StockRegisterPopup onClose={popup?.onClose} />}
			{popup?.type === EID.UPDATE && <StockUpdaterPopup item={popup?.item as DataType} onClose={popup?.onClose} />}

			{/* {popup?.type === 'append' && <Alert onClose={() => setPopup(undefined)} />} */}
		</>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
