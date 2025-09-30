import { styled } from '@styles/stitches.config';
import { PageContainer } from '../../../features/common/ui/PageContainer.ui';
import Flex from '@entites/Flex';
import { ST } from '@shared/config/kor.lang';
import { CardListWrap } from '@entites/Card';
import { Title } from '@entites/Title';
import { Text } from '@entites/Text';
import { useAssetData } from '@features/asset/hook/Asset.hook';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { toCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { AssetItemType, AssetResponse } from '@features/asset/api/asset.dto';
import { useMemo } from 'react';
import { ChartLineBox } from '@entites/ChartLine';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '@entites/Chart.type';
import { sortBy } from 'lodash';

const StyledPage = styled(PageContainer, {
	'.asset-chart': {
		padding: 4,
		'.box': {
			background: '$white',
		},
	},

	'.contents-layer': {
		'.list-header': {
			background: '$gray400',
			position: 'sticky',
			top: 0,
			zIndex: '$titleNavi',
			borderBottom: '1px solid $gray500',
		},

		'.list': {
			padding: '0',

			'.list-body': {
				padding: '4px 10px',
			},
		},

		'.minus': {
			color: '$minus',
		},

		'.plus': {
			color: '$plus',
		},
	},
});

export const AssetPageMo = ({ data }: { data?: AssetResponse }) => {
	// const { navigate } = useCommonHook();
	const { data: asset, evaluation } = useAssetData(data);

	const list = useMemo(() => {
		if (!asset || !evaluation) return undefined;

		return asset?.map<AssetItemType & { cprice?: number }>((a) => ({
			...a,
			cprice: evaluation?.find((b) => b.sdate === a.sdate)?.price || 0,
		}));
	}, [asset, evaluation]);

	const chartData = useMemo(() => {
		if (!asset || !evaluation) return undefined;

		const items = evaluation?.map<AssetItemType & { cprice?: number }>((a) => ({
			...a,
			cprice: asset?.find((b) => b.sdate === a.sdate)?.price || 0,
		}));

		return sortBy(items, ['sdate']);
	}, [asset, evaluation]);

	const domain = useMemo(() => {
		if (!chartData) return [];
		const items = sortBy(chartData, ['cprice']);
		return [Number(items?.[0]?.cprice) * 0.95, Number(items?.[chartData.length - 1]?.cprice) * 1.05];
	}, [chartData]);

	return (
		<>
			<StyledPage>
				{/* <PageTitleBar title={ST.ASSET} /> */}

				<Flex className='asset-chart' direction={'column'} gap={10}>
					<Title title={ST.ASSETVSEVALUATION} />
					<Flex className='box' direction={'column'} gap={10}>
						<ChartLineBox>
							<ResponsiveContainer>
								<LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 30 }}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='sdate' tickFormatter={(v) => `${dayjs(v).format('MM/DD')}`} />
									<YAxis
										tickFormatter={(v) => {
											return `${Math.round(v / 10_000) <= 0 ? 0 : Math.round(v / 10_000) + ST.MAN}`;
										}}
										domain={domain}
									/>
									<Tooltip
										formatter={(v: number) => toCost(v)}
										labelFormatter={(v) => `${dayjs(v).format('YYYY-MM-DD')}`}
									/>
									<Legend />
									<Line
										type='monotone'
										dataKey='price'
										name={ST.VALUATION}
										strokeWidth={2}
										dot={true}
										stroke={CHART_COLORS.RED}
									/>
									<Line
										type='monotone'
										dataKey='cprice'
										name={ST.ASSET}
										strokeWidth={2}
										dot={true}
										stroke={CHART_COLORS.BLUE}
									/>
								</LineChart>
							</ResponsiveContainer>
						</ChartLineBox>
					</Flex>
				</Flex>

				{/* 제목 */}

				<Flex className='contents-layer' direction={'column'} flex={1}>
					<Flex className='list-header' justify={'between'} height={34}>
						<Text bold text={ST.DATE} flex={1} textAlign={'center'} />
						<Text bold text={ST.EVALUATION} flex={1} textAlign={'center'} />
						<Text bold text={ST.ASSET} flex={1} textAlign={'center'} />
					</Flex>

					<CardListWrap>
						<Flex className={clsx('list')}>
							<Flex className={clsx('list-body')} direction='column' gap={4}>
								{list?.map((item) => {
									return (
										<Flex key={`asset-${item.rowid}`} className='row' justify={'between'} height={28}>
											<Text text={dayjs(item.sdate).format('YYYY-MM-DD')} flex={1} />
											<Text
												className={valueOfPlusMinus(item?.cprice, item.price)}
												text={item?.cprice ? toCost(item?.cprice) : ''}
												flex={2}
												align='right'
											/>
											<Text text={toCost(item?.price)} flex={2} align='right' />
										</Flex>
									);
								})}
							</Flex>
						</Flex>
					</CardListWrap>
				</Flex>
			</StyledPage>
		</>
	);
};
