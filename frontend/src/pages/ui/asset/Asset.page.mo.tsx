import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import Flex from '@entites/Flex';
import { ST } from '@shared/config/kor.lang';
import { Card, CardListWrap } from '@entites/Card';
import { SubTitle, Title } from '@entites/Title';
import { Text } from '@entites/Text';
import { useAssetData } from '@features/asset/hook/Asset.hook';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { toCost } from '@shared/libs/utils.lib';
import { AssetItemType, AssetResponse } from '@features/asset/api/asset.dto';
import { TitleNavigation } from '@entites/TitleNavigation';
import { useMemo } from 'react';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { URL } from '@shared/config/url.enum';
import { useSwipePage } from '@shared/hooks/useSwipePage.hook';
import { ChartLineBox } from '@entites/ChartLine';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '@entites/Chart.type';

const StyledPage = styled(PageContainer, {
	'.contents-layer': {
		'.card-list': {
			padding: '10px 0',

			'.card': {
				'.box': {
					padding: '4px 10px',
				},
			},
		},
	},
});

export const AssetPageMo = ({
	viewType = 'asset',
	data,
}: {
	viewType?: 'asset' | 'evaluation';
	data?: AssetResponse;
}) => {
	const { navigate } = useCommonHook();
	const { data: asset, evaluation } = useAssetData(data);

	const list = useMemo(() => {
		if (viewType === 'asset') return asset;
		else return evaluation;
	}, [viewType, data]);

	const chartData = useMemo(() => {
		if (!asset || !evaluation) return undefined;

		return evaluation?.map<AssetItemType & { cprice?: number }>((a) => ({
			...a,
			cprice: asset?.find((b) => b.sdate === a.sdate)?.price || 0,
		}));
	}, [asset, evaluation]);

	const onClick = (eid?: string) => {
		eid && navigate(`${URL.ASSET}/${eid}`);
	};

	const { handlerSwipe, swipeClass } = useSwipePage({
		onNextPage: () => {
			return `${URL.ASSET}/${viewType === 'asset' ? 'evaluation' : 'asset'}`;
		},
	});

	const naviOptions = useMemo(
		() => [
			{ label: ST.ASSET, value: 'asset' },
			{ label: ST.VALUATION, value: 'evaluation' },
		],
		[]
	);

	return (
		<>
			<StyledPage>
				{/* <PageTitleBar title={ST.ASSET} /> */}

				<Flex className='bucket-chart' direction={'column'} gap={10}>
					<Title title={ST.BUCKETLIST.CHART} />
					<Flex className='box' direction={'column'} gap={10}>
						<ChartLineBox>
							<ResponsiveContainer>
								<LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='sdate' tickFormatter={(v) => `${dayjs(v).format('MM/DD')}`} />
									<YAxis
										tickFormatter={(v) => {
											console.log({ v });
											return `${Math.round(v / 10_000) <= 0 ? 0 : Math.round(v / 10_000) + ST.MAN}`;
										}}
									/>
									<Tooltip
										formatter={(v: number) => toCost(v)}
										labelFormatter={(v) => `${dayjs(v).format('YYYY-MM-DD')}`}
									/>
									<Legend />
									<Line
										type='monotone'
										dataKey='price'
										name={ST.ASSET}
										strokeWidth={2}
										dot={true}
										stroke={CHART_COLORS.BLUE}
									/>
									<Line
										type='monotone'
										dataKey='cprice'
										name={ST.VALUATION}
										strokeWidth={2}
										dot={true}
										stroke={CHART_COLORS.RED}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartLineBox>
					</Flex>
				</Flex>

				{/* 제목 */}
				<TitleNavigation sticky options={naviOptions} value={viewType} onClick={onClick} />

				<Flex className='contents-layer' direction={'column'} flex={1} {...handlerSwipe}>
					<CardListWrap>
						<Card className={clsx('card')}>
							<Flex className={clsx('box border')} direction='column' gap={4}>
								<Flex className={clsx(swipeClass)} direction={'column'} justify={'center'}>
									{list?.map((item) => {
										return (
											<Flex key={`asset-${item.rowid}`} className='row' justify={'between'} height={28}>
												<SubTitle title={dayjs(item.sdate).format('YYYY-MM-DD')} />
												<Text text={toCost(item?.price)} />
											</Flex>
										);
									})}
								</Flex>
							</Flex>
						</Card>
					</CardListWrap>
				</Flex>
			</StyledPage>
		</>
	);
};
