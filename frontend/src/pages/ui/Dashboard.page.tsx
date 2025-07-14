import { useMemo, useState } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
// import { StatsForm } from '@features/StatsForm.ui';
import {
	DashboardSummaryData as SummaryData,
	DashboardTitleOptions as SelectOptions,
} from '@features/dashboard/config/Dashbord.data';
import {
	DashboardItemType as DataType,
	// DashboardResponse as ResponseType,
} from '@features/dashboard/api/dashboard.dto';
import { useSelectDashboard, useSelectDashboardSise } from '@features/dashboard/api/dashboard.api';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { FieldValues } from 'react-hook-form';
import { StockRegisterPopup } from '@features/dashboard/ui/StockRegister.popup';
import { URL } from '@shared/config/url.enum';
import { EID } from '@shared/config/default.config';
import { ST } from '@shared/config/kor.lang';
import { IconAdd } from '@entites/Icons';
import { useNavigate } from 'react-router-dom';
import { StockUpdaterPopup } from '@features/dashboard/ui/StockUpdater.popup';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	},
});

const DashboardPage = () => {
	const navigate = useNavigate();
	const [popup, setPopup] = useState<{ type: 'insert' | 'update'; item?: FieldValues }>();

	const { data } = useSelectDashboard();
	const { data: siseData } = useSelectDashboardSise();

	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const titleOptions = useMemo(() => {
		return SelectOptions();
	}, []);

	const list = useMemo(() => data?.value, [data]);
	const sise = useMemo(() => siseData?.value, [siseData]);
	// console.log({ list, sise });

	const onClick = (eid?: string, item?: DataType) => {
		let data = item;
		if (eid === EID.SELECT) {
			navigate(`${URL.MYSTOCK}/${item?.code}`);
		} else if (eid === EID.EDIT) {
			setPopup({ type: 'update', item: item });

			// this.setState({
			//   modal: {
			//     show: true, title: ST.ADD, state: STAT.I, size: 'sm', children: ModalEditor, data: { ...data },
			//     onOk: (data) => {
			//       (data != null) && actions.doUpdate(API.DASHBOARD, data).then(({ result }) => {
			//         const array = [...this.state.list];
			//         const item = array.find(item => item.stockid === result.rowid)
			//         if (item) {
			//           item.name = result.name;
			//           this.setState({ list: array, update: new Date() });
			//         }
			//         // this.doReload(() => this.doLoadSise());
			//       });
			//     }
			//   }
			// });
		} else if (eid === EID.DELETE) {
			// const msg = data.eprice ? ST.Q.STOCK_DELETE : null;
			// const type = data.eprice ? 'warn' : 'info';
			// this.setState({
			//   confirm: {
			//     show: true, msg, type, onClicked: (isOk) => {
			//       if (isOk) {
			//         const value = { 'state': STAT.D, 'rowid': String(data.stockid) };
			//         actions.doDelete(API.DASHBOARD, value).then(({ code, result }) => {
			//           this.setState({ alert: { show: true, code: code, key: new Date() } });
			//           this.doReload();
			//         });
			//       }
			//     },
			//   }
			// });
		} else if (eid === 'naver') {
			window.open(`${URL.REST.NAVER}?code=${data?.code.replace('A', '')}`);
		} else if (eid === 'daum') {
			window.open(`${URL.REST.DAUM}${data?.code}`);
		} else if (eid === 'daily') {
			// actions.go(URL.DAILY, { rowid: data.code });
		}
	};

	const onClickTitleBar = () => {
		console.log('[onClickTitleBar]');
		setPopup({ type: 'insert' });
	};

	const onChangeTitleBar = (value: string) => {
		console.log('[onClickTitleBar]', { value });
	};

	const onClosePopup = (eid: string, isOk: boolean) => {
		if (eid === EID.INSERT) {
			
		} else if (eid === EID.UPDATE) {

		}
		console.log('[onClickTitleBar]', { isOk });
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
						<DashboardCard key={item.code} data={item} siseData={sise} onClick={onClick} />
					))}
				</Flex>
			</StyledPage>

			{popup?.type === EID.INSERT && <StockRegisterPopup onClose={(isOk) => onClosePopup(popup.type, isOk)} />}
			{popup?.type === EID.UPDATE && <StockUpdaterPopup onClose={(isOk) => onClosePopup(popup.type, isOk)} />}

			{/* {popup?.type === 'append' && <Alert onClose={() => setPopup(undefined)} />} */}
		</>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
