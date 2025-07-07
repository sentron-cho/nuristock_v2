import { useMemo } from 'react';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { styled } from '@styles/stitches.config';
// import { StatsForm } from '@features/StatsForm.ui';
import { SummaryData } from '../../features/dashboard/config/Dashbord.data';
import { DashboardResponse as DataType } from '@features/dashboard/api/dashboard.dto';
import { useSelectDashboard } from '@features/dashboard/api/dashboard.api';
import { DashboardCard } from '@features/dashboard/ui/DashboardCard.ui';
import Flex from '@entites/Flex';
import { EID } from 'src/types/default.config';
import { URL } from 'src/types/url.enum';

const StyledPage = styled(PageContainer, {
	'.card-list': {
		flexWrap: 'wrap',
		gap: '$0',
	}
});

const DashboardPage = () => {
	const summaryData = useMemo(() => {
		return SummaryData();
	}, []);

	const { data: list } = useSelectDashboard();
	console.log(list);

	const onClick = (eid?: string, item?: DataType) => {
    let data = item;
    if (eid === EID.SELECT) {
      // this.setState({ selected: data });
      // this.props.onClick && this.props.onClick(eid, data, e);
      return;
    }

    if (eid === EID.NEW) {
      // this.props.history.push(`${URL.MARKET}`);
    } else if (eid === EID.EDIT) {
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
      window.open(`${URL.REST.NAVER}?code=${data?.code.replace('A', '')}`)
    } else if (eid === 'daum') {
      window.open(`${URL.REST.DAUM}${data?.code}`)
    } else if (eid === 'daily') {
      // actions.go(URL.DAILY, { rowid: data.code });
    }
  }

	return (
		<StyledPage summaryData={summaryData}>
			<Flex className='card-list'>
				{list?.map((item) => (
					<DashboardCard key={item.code} data={item} onClick={onClick}/>
				))}
			</Flex>
		</StyledPage>
	);
};

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
