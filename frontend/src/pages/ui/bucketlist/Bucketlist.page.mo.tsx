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
import { IconAddPlaylist } from '@entites/Icons';
import { Title } from '@entites/Title';
import { BucketlistHeader } from './BucketlistHeader.ui';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { URL } from '@shared/config/url.enum';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { useNaviByOptions } from '@shared/hooks/useOptionNavi.hook';
import { TitleNavigation } from '@entites/TitleNavigation';
import { Button } from '@entites/Button';
import { useMemo } from 'react';

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

export const BucketlistPageMo = ({
	refresh,
	data,
	onClick,
}: {
	refresh?: number;
	data?: BucklistResponse;
	onClick?: (eid?: string, item?: BucklistParamType) => void;
}) => {
	const { navigate } = useCommonHook();
	const { naviOptions, summaryData, params, list, chartData, headers, targetHeaders, targetList, page } =
		useBucketlistHook(data, refresh);
	const { prev, next } = useNaviByOptions({ options: naviOptions, value: page?.toString() });

	const isDelete = useMemo(() => {
		if (params?.page === 1) return false;

		return naviOptions?.length == params?.page;
	}, [naviOptions])

	const { handlerSwipe } = useSwipePage({
		onNextPage: (dir?: 'next' | 'prev') => {
			if (dir === 'prev') {
				return `${URL.BUCKET}/${prev?.value}`;
			} else {
				return `${URL.BUCKET}/${next?.value}`;
			}
		},
	});

	const onClickNavi = (eid?: string) => {
		eid && navigate(`${URL.BUCKET}/${eid}`);
	};

	return (
		<StyledPage summaryData={summaryData}>
			<Flex direction={'column'}>
				<PageTitleBar
					title={ST.INVESTMENT_SMIULATION}
					buttonProps={{
						buttonType: 'icon',
						eid: EID.ADD,
						icon: <IconAddPlaylist />,
						onClick: (eid) => onClick?.(eid, params),
					}}
				/>

				<TitleNavigation
					withTitleValue
					height={28}
					options={naviOptions}
					value={page?.toString()}
					onClick={onClickNavi}
				/>

				<BucketlistHeader params={params} onClick={() => onClick?.(EID.EDIT, params)} />

				<Flex className={clsx('contents-layer')} direction={'column'} {...handlerSwipe}>
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

					<Flex style={{ padding: 10, paddingTop: 20 }}>
						{isDelete && <Button fullWidth title={ST.DELETE} onClick={() => onClick?.(EID.DELETE, params)} />}
					</Flex>
				</Flex>
			</Flex>
		</StyledPage>
	);
};
