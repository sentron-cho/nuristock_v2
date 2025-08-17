import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import Flex from '@entites/Flex';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { PageTitleBar } from '@features/common/ui/PageTitleBar.ui';
import { ST } from '@shared/config/kor.lang';
import { BucklistParamType, BucklistResponse } from '@features/bucketlist/api/bucketlist.dto';
import { useBucketlistHook } from '@features/bucketlist/hook/Bucketlist.hook';
import { ChartLine } from '@entites/ChartLine';
import { Table } from '@entites/Table';
import { EID } from '@shared/config/default.config';
import { IconTune } from '@entites/Icons';
import { Title } from '@entites/Title';
import { BucketlistHeader } from './BucketlistHeader.ui';

const StyledPage = styled(PageContainer, {
	'.bucket-chart': {
		padding: '$4',
		'.box': {
			paddingTop: '10px',
			background: '$white',
		},
	},

	'.bucket-table, .bucket-guide': {
		padding: '$4',
	},
});

export const BucketlistPageMo = ({ refresh, data, onClick }: { refresh?: number; data?: BucklistResponse, onClick?: (eid?: string, item?: BucklistParamType) => void }) => {
	const { summaryData, params, list, chartData, headers, targetHeaders, targetList } = useBucketlistHook(data, refresh);

	return (
		<StyledPage summaryData={summaryData}>
			<Flex direction={'column'}>
				<PageTitleBar
					title={ST.INVESTMENT_SMIULATION}
					buttonProps={{
						buttonType: 'icon',
						eid: EID.SETTING,
						icon: <IconTune />,
						onClick: (eid) => onClick?.(eid, params),
					}}
				/>

				<BucketlistHeader params={params} />

				<Flex className={clsx('contents-layer')} direction={'column'}>
					<Flex className='bucket-chart' direction={'column'} gap={10}>
						<Title title={ST.BUCKETLIST.CHART} />
						<Flex className='box' direction={'column'} gap={10}>
							<ChartLine data={chartData} />
						</Flex>
					</Flex>

					<Flex className='bucket-table' direction={'column'} gap={10}>
						<Title title={ST.BUCKETLIST.TABLE} />
						<Table rowKey={'year'} headers={headers} data={list} width={'100%'} />
					</Flex>
					
					<Flex className='bucket-table target' direction={'column'} gap={10}>
						<Title title={ST.BUCKETLIST.TARGET_TABLE} />
						<Table rowKey={'year'} headers={targetHeaders} data={targetList} width={'100%'} />
					</Flex>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
